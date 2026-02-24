import { TRPCError } from '@trpc/server'

import {
  and,
  authUserPersonId,
  authUserProfileId,
  eq,
  or,
  queryPersonId,
  schema,
  type DbTransaction,
} from '@my/db'
import { now } from '@my/db/functions'
import { z } from '@my/lib/zod'

import { protectedProcedure, publicProcedure } from '../trpc'

export const personRouter = {
  id: protectedProcedure.query(async ({ ctx: { rls } }) => {
    return rls(async (tx) => {
      const [row] = await tx.execute<{ personId: number }>(queryPersonId)
      return row.personId
    })
  }),
  document: {
    list: protectedProcedure.query(async ({ ctx: { rls, supabase } }) => {
      const documents = await rls((tx) => {
        return tx
          .select({
            personId: schema.personDocument.personId,
            typeId: schema.personDocumentType.id,
            typeName: schema.personDocumentType.name,
            number: schema.personDocument.number,
            path: schema.personDocument.path,
            note: schema.personDocument.note,
            relation: schema.personRelationType.name,
          })
          .from(schema.personDocument)
          .innerJoin(
            schema.personDocumentType,
            eq(schema.personDocument.type, schema.personDocumentType.id),
          )
          .leftJoin(
            schema.personRelation,
            eq(schema.personRelation.relativeId, schema.personDocument.personId),
          )
          .leftJoin(
            schema.personRelationType,
            eq(schema.personRelation.relation, schema.personRelationType.id),
          )
          .where(
            or(
              eq(schema.personDocument.personId, authUserPersonId),
              eq(schema.personDocument.createdBy, authUserProfileId),
            ),
          )
      })
      if (documents.length === 0) return []

      const bkt = supabase.storage.from('__documents')
      const { data, error } = await bkt.createSignedUrls(
        documents.map((d) => d.path || ''),
        600,
      )
      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create signed urls',
          cause: error,
        })
      }
      return documents.map((doc, i) => ({
        ...doc,
        signedUrl: data[i].error ? null : data[i].signedUrl,
      }))
    }),
    type: {
      list: publicProcedure.query(async ({ ctx: { rls } }) => {
        return rls((tx) => tx.select().from(schema.personDocumentType))
      }),
    },
    getSignedUrl: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
        }),
      )
      .query(async ({ input, ctx: { rls, supabase } }) => {
        const [{ personId }] = await rls((tx) => tx.execute<{ personId: number }>(queryPersonId))

        const bkt = supabase.storage.from('__documents')
        const fileName = `${Date.now().toString(36)}_${input.fileName.replace(/\W+/g, '_')}`
        const { data, error } = await bkt.createSignedUploadUrl(`${personId}/${fileName}`)
        if (error) {
          if (error.message === 'new row violates row-level security policy') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Permission Denied', cause: error })
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create signed upload url',
            cause: error,
          })
        }
        return data
      }),
    create: protectedProcedure
      .input(
        z.object({
          relation: z.string().default('mine'),
          documentType: z.number(),
          documentNo: z.string(),
          filePath: z.string(),
          note: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx: { rls } }) => {
        return rls(async (tx) => {
          const personId = await resolvePersonIdFromRelation(tx, input.relation)

          await tx.insert(schema.personDocument).values({
            personId,
            type: input.documentType,
            number: input.documentNo,
            path: input.filePath,
            note: input.note,
          })
        })
      }),
    update: protectedProcedure
      .input(
        z.object({
          personId: z.number(),
          documentType: z.number(),
          relation: z.string().optional(),
          newDocumentType: z.number().optional(),
          documentNo: z.string().nullish(),
          filePath: z.string().nullish(),
          note: z.string().nullish(),
        }),
      )
      .mutation(async ({ input, ctx: { rls } }) => {
        return rls(async (tx) => {
          const personId =
            input.relation ? await resolvePersonIdFromRelation(tx, input.relation) : undefined

          await tx
            .update(schema.personDocument)
            .set({
              personId,
              type: input.newDocumentType,
              number: input.documentNo,
              path: input.filePath,
              note: input.note,
              updatedAt: now(),
            })
            .where(
              and(
                eq(schema.personDocument.personId, input.personId),
                eq(schema.personDocument.type, input.documentType),
              ),
            )
        })
      }),
  },
}

async function resolvePersonIdFromRelation(tx: DbTransaction, relation?: string) {
  const [row] = await (relation === 'father' || relation === 'mother' ?
    tx
      .select({ personId: schema.personRelation.relativeId })
      .from(schema.personRelation)
      .where(
        and(
          eq(schema.personRelation.personId, authUserPersonId),
          eq(schema.personRelation.relation, relation === 'father' ? 1 : 2),
        ),
      )
  : tx.execute<{ personId: number }>(queryPersonId))

  if (!row?.personId)
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Related person not found' })

  return row.personId
}
