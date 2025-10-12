import { and, desc, eq, schema, sql } from '@my/db'
import { placeIdToLocation } from '@my/lib/maps'
import { z } from '@my/lib/zod'

import { userDisplayName } from '../lib/utils'
import { protectedProcedure } from '../trpc'

export const priyasthanRouter = {
  workplace: {
    getPreferred: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      const addresses = await db
        .select({
          placeId: schema.address.placeId,
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
        .orderBy(desc(schema.profileAddress.updatedAt))

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
            tx.select().from(schema.address).where(eq(schema.address.placeId, input.placeId)),
          ])

          if (!exists) {
            // create address if not exists
            const location = await placeIdToLocation(input.placeId)
            await tx.insert(schema.address).values({
              placeId: input.placeId,
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
              addressId: 0,
              type: 'preferred-workplace',
            })
            .onConflictDoUpdate({
              target: [schema.profileAddress.profileId, schema.profileAddress.addressId],
              set: { updatedAt: sql`now()` },
            })
        })

        return { message: 'done' }
      }),
    recent0: protectedProcedure.query(({ ctx: { db } }) => {
      const currentWorkplaces = db
        .selectDistinctOn([schema.profileAddress.profileId], {
          profileId: schema.profileAddress.profileId,
          addressId: schema.profileAddress.addressId,
          geom: schema.address.geom,
        })
        .from(schema.profileAddress)
        .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
        .where(eq(schema.profileAddress.type, 'current-workplace'))
        .orderBy(desc(schema.profileAddress.updatedAt))
        .as('current_workplaces')

      // return currentWorkplaces

      //
      const preferredWorkplaces = db
        .select({
          profileId: schema.profileAddress.profileId,
          addressId: schema.profileAddress.addressId,
          geom: schema.address.geom,
        })
        .from(schema.profileAddress)
        .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
        .innerJoin(
          currentWorkplaces,
          and(
            eq(schema.profileAddress.profileId, currentWorkplaces.profileId),
            sql`ST_DWithin(${schema.address.geom}::geography, ${currentWorkplaces.geom}::geography, 100000)`,
          ),
        )
        .where(eq(schema.profileAddress.type, 'preferred-workplace'))
      // .as('preferred_workplaces')
    }),
    recent: protectedProcedure.query(({ ctx: { db } }) => {
      return db
        .select({
          profile: {
            id: schema.profileAddress.profileId,
            displayName: userDisplayName,
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
    recent2: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      const userIdToProfileId = db
        .select({ profileId: schema.profile.id })
        .from(schema.profile)
        .where(eq(schema.profile.createdBy, authUserId))
        .as('user_id_to_profile_id')

      const myWorkplace = db
        .select({
          geom: schema.address.geom,
        })
        .from(schema.profileAddress)
        .innerJoin(schema.profile, eq(schema.profile.id, schema.profileAddress.profileId))
        .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
        .where(
          and(
            eq(schema.profileAddress.type, 'current-workplace'),
            eq(schema.profile.createdBy, authUserId),
          ),
        )
        .orderBy(desc(schema.profileAddress.updatedAt))
        .limit(1)
        .as('my_workplace')

      const myPreferredLocations = db
        .select({
          geom: schema.address.geom,
        })
        .from(schema.profileAddress)
        .innerJoin(schema.profile, eq(schema.profile.id, schema.profileAddress.profileId))
        .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
        .where(
          and(
            eq(schema.profileAddress.type, 'preferred-workplace'),
            eq(schema.profile.createdBy, authUserId),
          ),
        )
        .as('my_preferred_locations')

      // get all addresses which are current-workplace and within 100km of any of the user's preferred locations
      const nearbyWorkplacesToMyPreferredLocations = db
        .selectDistinct({
          profileId: schema.profileAddress.profileId,
        })
        .from(schema.address)
        .innerJoin(schema.profileAddress, eq(schema.profileAddress.addressId, schema.address.id))
        .innerJoin(
          myPreferredLocations,
          sql`ST_DWithin(${schema.address.geom}::geography, ${myPreferredLocations.geom}::geography, 100000)`,
        )
        .where(eq(schema.profileAddress.type, 'current-workplace'))
        .as('nearby_workplaces_to_my_preferred_locations')

      const othersPreferredLocations = db
        .select({
          id: schema.address.id,
          geom: schema.address.geom,
          latitude: schema.address.latitude,
          longitude: schema.address.longitude,
          profileId: schema.profileAddress.profileId,
          type: schema.profileAddress.type,
        })
        .from(nearbyWorkplacesToMyPreferredLocations)
        .innerJoin(
          schema.profileAddress,
          eq(schema.profileAddress.profileId, nearbyWorkplacesToMyPreferredLocations.profileId),
        )
        .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
        .where(eq(schema.profileAddress.type, 'preferred-workplace'))
        .as('others_preferred_locations')

      return db
        .select({
          id: othersPreferredLocations.id,
          latitude: othersPreferredLocations.latitude,
          longitude: othersPreferredLocations.longitude,
          profileId: othersPreferredLocations.profileId,
          type: othersPreferredLocations.type,
        })
        .from(othersPreferredLocations)
        .innerJoin(
          myWorkplace,
          sql`ST_DWithin(${othersPreferredLocations.geom}::geography, ${myWorkplace.geom}::geography, 100000)`,
        )
    }),
  },
}
