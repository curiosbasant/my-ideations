import { TRPCError } from '@trpc/server'

import { schema, type DbTransaction } from '@my/db'
import { selectPersonId, userPersonId, userProfileId } from '@my/db/db-functions'
import { profileDisplayName } from '@my/db/helpers'
import { and, coalesce, desc, eq, extractJson, now, or } from '@my/db/sql'
import { sanitizeFilenameForStorage } from '@my/lib/utils'
import { z } from '@my/lib/zod'

import { objects } from '../../../db/src/utils/helpers/supabase'
import { protectedProcedure, publicProcedure } from '../trpc'

export const personRouter = {
  id: protectedProcedure.query(async ({ ctx: { rls } }) => {
    return rls(async (tx) => {
      const [row] = await tx.execute<{ personId: number }>(selectPersonId)
      return row.personId
    })
  }),
  document: {
    list: protectedProcedure.query(async ({ ctx: { rls, supabase } }) => {
      const documents = await rls((tx) => {
        return tx
          .select({
            personId: schema.personDocument.personId,
            type: schema.personDocumentType,
            number: schema.personDocument.number,
            note: schema.personDocument.note,
            file: {
              path: schema.personDocument.path,
              mimetype: extractJson(objects.metadata, 'mimetype').as<string>('mimetype'),
              size: extractJson(objects.metadata, 'size').mapWith(Number),
            },
            relation: schema.personRelationType.name,
            createdBy: {
              displayName: profileDisplayName().as('creator_display_name'),
              avatarUrl: schema.profile.avatarUrl,
            },
            lastModifiedAt: coalesce(
              schema.personDocument.updatedAt,
              schema.personDocument.createdAt,
            ).as('last_modified_at'),
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
          .leftJoin(schema.profile, eq(schema.profile.id, schema.personDocument.createdBy))
          .leftJoin(objects, eq(objects.name, schema.personDocument.path))
          .where(
            or(
              eq(schema.personDocument.personId, userPersonId),
              eq(schema.personDocument.createdBy, userProfileId),
            ),
          )
          .orderBy(desc(coalesce(schema.personDocument.updatedAt, schema.personDocument.createdAt)))
      })
      if (documents.length === 0) return []

      const bkt = supabase.storage.from('__documents')
      const { data, error } = await bkt.createSignedUrls(
        documents.map((d) => d.file.path || ''),
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
        const [{ personId }] = await rls((tx) => tx.execute<{ personId: number }>(selectPersonId))

        const bkt = supabase.storage.from('__documents')
        const filePath = `${personId}/${sanitizeFilenameForStorage(input.fileName)}`
        const { data, error } = await bkt.createSignedUploadUrl(filePath)
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
          documentType: z.string(),
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
          personId: z.string(),
          documentType: z.string(),
          relation: z.string().optional(),
          newDocumentType: z.string().optional(),
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
          eq(schema.personRelation.personId, userPersonId),
          eq(schema.personRelation.relation, relation === 'father' ? '1' : '2'),
        ),
      )
  : tx.execute<{ personId: string }>(selectPersonId))

  if (!row?.personId)
    throw new TRPCError({ code: 'NOT_FOUND', message: `Relation with ${relation} not found` })

  return row.personId
}
