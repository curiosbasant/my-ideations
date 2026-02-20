import { TRPCError } from '@trpc/server'

import {
  and,
  authUserPersonId,
  authUserProfileId,
  buildConflictUpdateColumns,
  eq,
  or,
  queryPersonId,
  schema,
  sql,
} from '@my/db'
import { concat, now } from '@my/db/functions'
import { z } from '@my/lib/zod'

import { protectedProcedure, publicProcedure } from '../trpc'

export const personRouter = {
  document: {
    list: protectedProcedure.query(async ({ ctx: { rls, supabase } }) => {
      const documents = await rls((tx) => {
        return tx
          .select({
            id: concat(
              sql`${schema.personDocument.personId}::text`,
              sql`${schema.personDocument.type}::text`,
            ).as('id'),
            type: schema.personDocumentType.name,
            number: schema.personDocument.number,
            path: schema.personDocument.path,
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
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create signed upload url',
            cause: error,
          })
        }
        return data
      }),
    set: protectedProcedure
      .input(
        z.object({
          relation: z.literal(['oneself', 'father', 'mother']).default('oneself'),
          documentType: z.number(),
          documentNo: z.string(),
          filePath: z.string(),
        }),
      )
      .mutation(async ({ input, ctx: { rls } }) => {
        return rls(async (tx) => {
          const [{ personId }] = await (input.relation === 'oneself' ?
            tx.execute<{ personId: number }>(queryPersonId)
          : tx
              .select({ personId: schema.personRelation.relativeId })
              .from(schema.personRelation)
              .where(
                and(
                  eq(schema.personRelation.personId, authUserPersonId),
                  eq(schema.personRelation.relation, input.relation === 'father' ? 1 : 2),
                ),
              ))
          await tx
            .insert(schema.personDocument)
            .values({
              personId,
              type: input.documentType,
              number: input.documentNo,
              path: input.filePath,
            })
            .onConflictDoUpdate({
              target: [schema.personDocument.personId, schema.personDocument.type],
              set: {
                ...buildConflictUpdateColumns(schema.personDocument, ['number', 'path']),
                updatedAt: now(),
              },
            })
        })
      }),
  },
}
