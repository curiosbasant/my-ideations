import { schema } from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../trpc'

export const feedbackRouter = {
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        content: z.string(),
        type: z.string(),
        rating: z.number().min(1).max(5),
        page: z.string().nullish(),
      }),
    )
    .mutation(({ input, ctx: { rls } }) => {
      return rls(async (tx) => {
        const [row] = await tx.insert(schema.feedback).values(input)
        return row
      })
    }),
  type: {
    list: protectedProcedure.query(async ({ ctx: { rls } }) => {
      return rls((tx) => tx.select().from(schema.feedbackType))
    }),
  },
}
