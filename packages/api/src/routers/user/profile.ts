import { TRPCError } from '@trpc/server'

import { schema } from '@my/db'
import { profileDisplayName } from '@my/db/helpers'
import { eq } from '@my/db/sql'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../../trpc'

export const profileRouter = {
  get: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ ctx: { rls }, input }) => {
      const [profile] = await rls((tx) =>
        tx
          .select({
            id: schema.profile.id,
            displayName: profileDisplayName().as('display_name'),
            avatarUrl: schema.profile.avatarUrl,
          })
          .from(schema.profile)
          .where(eq(schema.profile.id, input.profileId)),
      )
      if (profile) return profile

      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Profile with id "${input.profileId}" does not exist.`,
      })
    }),
}
