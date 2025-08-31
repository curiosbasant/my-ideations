import { eq, schema } from '@my/db'
import { placeIdToLocation } from '@my/lib/maps'
import { z } from '@my/lib/zod'

import { userDisplayName } from '../lib/utils'
import { protectedProcedure, publicProcedure } from '../trpc'

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
  address: {
    get: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      const [address] = await db
        .select({
          placeId: schema.address.id,
          addressText: schema.address.text,
          addressSecondaryText: schema.address.secondaryText,
          latitude: schema.address.latitude,
          longitude: schema.address.longitude,
        })
        .from(schema.profile)
        .leftJoin(schema.profileAddress, eq(schema.profileAddress.profileId, schema.profile.id))
        .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
        .where(eq(schema.profile.createdBy, authUserId))
        .limit(1)

      return address || null
    }),
    update: protectedProcedure
      .input(
        z.object({
          placeId: z.string(),
          text: z.string(),
          secondaryText: z.string().nullish(),
        }),
      )
      .mutation(async ({ ctx: { db, authUserId }, input }) => {
        await db.transaction(async (tx) => {
          const [[{ id }], [exists]] = await Promise.all([
            // exchange authId with profileId
            tx
              .select({ id: schema.profile.id })
              .from(schema.profile)
              .where(eq(schema.profile.createdBy, authUserId)),
            // check if address already exists

            tx.select().from(schema.address).where(eq(schema.address.id, input.placeId)),
          ])

          if (!exists) {
            // create address if not exists
            const location = await placeIdToLocation(input.placeId)
            await tx.insert(schema.address).values({
              id: input.placeId,
              text: input.text,
              secondaryText: input.secondaryText,
              latitude: location.latitude,
              longitude: location.longitude,
            })
          }

          // link profile with address
          await tx
            .insert(schema.profileAddress)
            .values({
              profileId: id,
              addressId: input.placeId,
            })
            .onConflictDoNothing()
        })

        return { message: 'done' }
      }),
  },
}
