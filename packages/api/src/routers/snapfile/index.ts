import { TRPCError } from '@trpc/server'

import { schema } from '@my/db'
import { desc, eq, ilike } from '@my/db/sql'
import { sanitizeFilenameForStorage } from '@my/lib/utils'
import { z } from '@my/lib/zod'

import { protectedProcedure, publicProcedure } from '../../trpc'
import { roomRouter } from './room'

export const snapfileRouter = {
  create: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
      }),
    )
    .mutation(({ input, ctx: { rls } }) => {
      const fileShortCode = Date.now().toString(36)
      const filePath = sanitizeFilenameForStorage(input.fileName)

      return rls(async (tx) => {
        const values = {
          code: fileShortCode,
          url: filePath,
        }
        await tx.insert(schema.sf__shortUrl).values(values)
        return values
      })
    }),
  publicUrl: publicProcedure
    .input(z.string())
    .query(async ({ input: shortcode, ctx: { rls, supabase } }) => {
      const filePath = await rls(async (tx) => {
        const [row] = await tx
          .select({
            url: schema.sf__shortUrl.url,
          })
          .from(schema.sf__shortUrl)
          .where(eq(schema.sf__shortUrl.code, shortcode))
        if (!row) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No record found' })
        }
        return row.url
      })

      const bkt = supabase.storage.from('sf__files')
      return bkt.getPublicUrl(filePath, { download: true }).data.publicUrl
    }),
  format: {
    list: publicProcedure
      .input(z.object({ query: z.string().nullish() }))
      .query(async ({ input, ctx: { rls, supabase } }) => {
        const formats = await rls((tx) =>
          tx
            .select()
            .from(schema.sf__formats)
            .where(ilike(schema.sf__formats.name, `%${input.query}%`).if(input.query))
            .limit(10)
            .orderBy(desc(schema.sf__formats.createdAt)),
        )
        const bkt = supabase.storage.from('sf__files')
        return formats.map((format) => ({
          ...format,
          url: bkt.getPublicUrl(format.path).data.publicUrl,
        }))
      }),
    create: protectedProcedure
      .input(
        z.object({
          fileOriginalName: z.string().nonempty(),
          fileName: z.string().nonempty(),
          description: z.string().nullish(),
        }),
      )
      .mutation(async ({ input, ctx: { rls } }) => {
        const filePath = `formats/${sanitizeFilenameForStorage(input.fileOriginalName)}`

        await rls(async (tx) => {
          await tx.insert(schema.sf__formats).values({
            name: input.fileName,
            description: input.description,
            path: filePath,
          })
        })
        return { filePath }
      }),
  },
  room: roomRouter,
}
