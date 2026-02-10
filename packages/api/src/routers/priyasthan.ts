import { and, desc, eq, isAllNotNull, profileDisplayName, schema, unionAll } from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../trpc'

export const priyasthanRouter = {
  workplace: {
    list: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      const places = unionAll(
        db
          .selectDistinctOn([schema.profileAddress.profileId])
          .from(schema.profileAddress)
          .where(eq(schema.profileAddress.type, 'current-workplace'))
          .orderBy(schema.profileAddress.profileId, desc(schema.profileAddress.updatedAt)),
        db
          .select()
          .from(schema.profileAddress)
          .where(eq(schema.profileAddress.type, 'preferred-workplace')),
      ).as('wp')

      const locations = await db
        .select({
          profileId: schema.profile.id,
          addressId: schema.address.id,
          text: schema.address.text,
          latitude: schema.address.latitude,
          longitude: schema.address.longitude,
          type: places.type,
        })
        .from(places)
        .innerJoin(schema.profile, eq(schema.profile.id, places.profileId))
        .innerJoin(schema.address, eq(schema.address.id, places.addressId))
        .where(
          and(
            isAllNotNull(schema.address.latitude, schema.address.longitude),
            eq(schema.profile.createdBy, authUserId),
          ),
        )
      return locations.map((l) => ({
        ...l,
        latitude: l.latitude!,
        longitude: l.longitude!,
        type: l.type!,
      }))
    }),
    create: protectedProcedure
      .input(
        z.object({
          text: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          type: z.enum(['current-workplace', 'preferred-workplace']),
        }),
      )
      .mutation(async ({ ctx: { db, authUserId }, input }) => {
        return db.transaction(async (tx) => {
          const [[{ profileId }], [{ addressId }]] = await Promise.all([
            // exchange authId with profileId
            tx
              .select({ profileId: schema.profile.id })
              .from(schema.profile)
              .where(eq(schema.profile.createdBy, authUserId)),
            tx
              .insert(schema.address)
              .values({
                text: input.text,
                latitude: input.latitude,
                longitude: input.longitude,
              })
              .returning({ addressId: schema.address.id }),
          ])
          await tx.insert(schema.profileAddress).values({ profileId, addressId, type: input.type })
          return addressId
        })
      }),
    update: protectedProcedure
      .input(
        z.object({
          addressId: z.number(),
          text: z.string().optional(),
          latitude: z.number(),
          longitude: z.number(),
        }),
      )
      .mutation(async ({ ctx: { db }, input }) => {
        return db
          .update(schema.address)
          .set({
            text: input.text,
            latitude: input.latitude,
            longitude: input.longitude,
          })
          .where(eq(schema.address.id, input.addressId))
      }),
    recent: protectedProcedure.query(({ ctx: { db } }) => {
      return db
        .select({
          profile: {
            id: schema.profileAddress.profileId,
            displayName: profileDisplayName().as('display_name'),
            avatarUrl: schema.profile.avatarUrl,
          },
          address: {
            id: schema.profileAddress.addressId,
            text: schema.address.text,
          },
          createdAt: schema.profileAddress.updatedAt,
        })
        .from(schema.profileAddress)
        .innerJoin(schema.profile, eq(schema.profile.id, schema.profileAddress.profileId))
        .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
        .where(eq(schema.profileAddress.type, 'preferred-workplace'))
        .orderBy(desc(schema.profileAddress.updatedAt))
        .limit(10)
    }),
  },
}
