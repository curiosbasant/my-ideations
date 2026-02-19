import { TRPCError } from '@trpc/server'

import {
  authUserPersonId,
  buildConflictUpdateColumns,
  eq,
  queryPersonId,
  schema,
  sql,
} from '@my/db'
import { concat, now } from '@my/db/functions'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../trpc'

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
          })
          .from(schema.personDocument)
          .innerJoin(
            schema.personDocumentType,
            eq(schema.personDocument.type, schema.personDocumentType.id),
          )
          .where(eq(schema.personDocument.personId, authUserPersonId))
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
          docNumber: z.string(),
          filePath: z.string(),
        }),
      )
      .mutation(async ({ input, ctx: { rls } }) => {
        return rls(async (tx) => {
          const [{ personId }] = await tx.execute<{ personId: number }>(queryPersonId)

          await tx
            .insert(schema.personDocument)
            .values({
              personId,
              type: 1,
              number: input.docNumber,
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
