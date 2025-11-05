import { and, db, desc, eq, schema, sql, unionAll } from '@my/db'
import { z } from '@my/lib/zod'

import { isAllNotNull, userDisplayName } from '../lib/utils'
import { protectedProcedure } from '../trpc'

const cw = db
  .$with('current_workplaces')
  .as((qb) =>
    qb
      .selectDistinctOn([schema.profileAddress.profileId])
      .from(schema.profileAddress)
      .where(eq(schema.profileAddress.type, 'current-workplace'))
      .orderBy(schema.profileAddress.profileId, desc(schema.profileAddress.updatedAt)),
  )

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
        .unionAll(getMatch(authUserId))
      return locations.map((l) => ({
        ...l,
        latitude: l.latitude!,
        longitude: l.longitude!,
        type: l.type!,
      }))
    }),
    match: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      db.with(cw)
        .select({ geom: schema.address.geom })
        .from(cw)
        .innerJoin(schema.address, eq(schema.address.id, cw.addressId))
        .innerJoin(schema.profile, eq(schema.profile.id, cw.profileId))
        .where(eq(schema.profile.createdBy, authUserId))
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
  },
}

function getMatch(authUserId: string) {
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

  //
  const othersPreferredLocations = db
    .select({
      addressId: schema.address.id,
      text: schema.address.text,
      updatedAt: schema.address.updatedAt,
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
      profileId: othersPreferredLocations.profileId,
      addressId: othersPreferredLocations.addressId,
      text: othersPreferredLocations.text,
      latitude: othersPreferredLocations.latitude,
      longitude: othersPreferredLocations.longitude,
      type: sql.raw("'match'").as('type'),
    })
    .from(othersPreferredLocations)
    .innerJoin(
      myWorkplace,
      sql`ST_DWithin(${othersPreferredLocations.geom}::geography, ${myWorkplace.geom}::geography, 100000)`,
    )
}

/*
  profileId: schema.profile.id,
          addressId: schema.address.id,
          text: schema.address.text,
          latitude: schema.address.latitude,
          longitude: schema.address.longitude,
          type: places.type,
*/
