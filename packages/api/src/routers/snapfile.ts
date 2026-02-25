import { desc, ilike, schema } from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure, publicProcedure } from '../trpc'

export const snapfileRouter = {
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
          fileName: z.string().nonempty(),
          description: z.string().nullish(),
          path: z.string().nonempty(),
        }),
      )
      .mutation(({ input, ctx: { rls } }) => {
        return rls(async (tx) => {
          await tx.insert(schema.sf__formats).values({
            name: input.fileName,
            description: input.description,
            path: input.path,
          })
        })
      }),
  },
}
