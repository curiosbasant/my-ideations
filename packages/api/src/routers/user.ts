import { eq, schema } from '@my/db'
import { z } from '@my/lib/zod'

import { userDisplayName } from '../lib/utils'
import { publicProcedure } from '../trpc'

export const userRouter = {
  get: publicProcedure
    .input(z.object({ userId: z.coerce.number() }))
    .query(async ({ ctx: { db }, input }) => {
      const [user] = await db
        .select({ id: schema.profile.id, displayName: userDisplayName })
        .from(schema.profile)
        .where(eq(schema.profile.id, input.userId))
      return user
    }),
}
