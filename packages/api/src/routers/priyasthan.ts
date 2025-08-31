import { and, desc, eq, schema, sql } from '@my/db'
import { placeIdToLocation } from '@my/lib/maps'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../trpc'

export const priyasthanRouter = {
  workplace: {
    getPreferred: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      const addresses = await db
        .select({
          placeId: schema.address.id,
          addressText: schema.address.text,
          addressSecondaryText: schema.address.secondaryText,
        })
        .from(schema.profile)
        .leftJoin(schema.profileAddress, eq(schema.profileAddress.profileId, schema.profile.id))
        .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
        .where(
          and(
            eq(schema.profileAddress.type, 'preferred-workplace'),
            eq(schema.profile.createdBy, authUserId),
          ),
        )
        .orderBy(desc(schema.profileAddress.updatedAt)) // only take the latest address

      return addresses
    }),
    savePreferred: protectedProcedure
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
              type: 'preferred-workplace',
            })
            .onConflictDoUpdate({
              target: [schema.profileAddress.profileId, schema.profileAddress.addressId],
              set: { updatedAt: sql`now()` },
            })
        })

        return { message: 'done' }
      }),
  },
}
