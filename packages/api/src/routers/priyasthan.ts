import { getColumns, schema, union } from '@my/db'
import { selectProfileId } from '@my/db/db-functions'
import { isAllNotNull, profileDisplayName } from '@my/db/helpers'
import { and, desc, eq, inArray, ne, sql, ST_DWithin } from '@my/db/sql'
import type { RemoveNullable } from '@my/lib/types'
import { z } from '@my/lib/zod'

import { ensureSingleRow } from '../lib/utils/helpers'
import { protectedProcedure } from '../trpc'

export const priyasthanRouter = {
  workplace: {
    list: protectedProcedure.query(async ({ ctx: { rls } }) => {
      const km50 = sql<number>`50000`
      return rls(async (tx) => {
        const allCurrentWorkplaces = tx.$with('acw').as((qb) =>
          qb
            .selectDistinctOn([schema.profileAddress.profileId], {
              profileId: schema.profileAddress.profileId,
              addressId: schema.profileAddress.addressId,
              geom: schema.address.geom,
              latitude: schema.address.latitude,
              longitude: schema.address.longitude,
              type: schema.profileAddress.type,
            })
            .from(schema.profileAddress)
            .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
            .where(
              and(
                isAllNotNull(schema.address.latitude, schema.address.longitude),
                eq(schema.profileAddress.type, sql.raw("'current-workplace'")),
              ),
            )
            .orderBy(schema.profileAddress.profileId, desc(schema.profileAddress.updatedAt)),
        )

        const allPreferredWorkplaces = tx.$with('apw').as((qb) =>
          qb
            .select({
              profileId: schema.profileAddress.profileId,
              addressId: schema.profileAddress.addressId,
              geom: schema.address.geom,
              latitude: schema.address.latitude,
              longitude: schema.address.longitude,
              type: schema.profileAddress.type,
            })
            .from(schema.profileAddress)
            .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
            .where(
              and(
                isAllNotNull(schema.address.latitude, schema.address.longitude),
                eq(schema.profileAddress.type, sql.raw("'preferred-workplace'")),
              ),
            ),
        )

        const ctePairs = tx.$with('pairs').as((qb) =>
          qb
            .with(allCurrentWorkplaces, allPreferredWorkplaces)
            .select({
              currentProfileId: allCurrentWorkplaces.profileId.as('currentProfileId'),
              preferredProfileId: allPreferredWorkplaces.profileId.as('preferredProfileId'),
            })
            .from(allCurrentWorkplaces)
            .innerJoin(
              allPreferredWorkplaces,
              and(
                // make pairs with others preferred workplaces except mine
                ne(allCurrentWorkplaces.profileId, allPreferredWorkplaces.profileId),
                ST_DWithin(allCurrentWorkplaces.geom, allPreferredWorkplaces.geom, km50),
              ),
            )
            .where(
              inArray(selectProfileId, [
                allCurrentWorkplaces.profileId,
                allPreferredWorkplaces.profileId,
              ]),
            ),
        )

        const { geom: _1, ...acw } = getColumns(allCurrentWorkplaces)
        const { geom: _2, ...apw } = getColumns(allPreferredWorkplaces)
        const [myWorkPlaces, pairs] = await Promise.all([
          union(
            tx
              .with(allCurrentWorkplaces)
              .select(acw)
              .from(allCurrentWorkplaces)
              .where(eq(selectProfileId, allCurrentWorkplaces.profileId)),
            tx
              .with(allPreferredWorkplaces)
              .select(apw)
              .from(allPreferredWorkplaces)
              .where(eq(selectProfileId, allPreferredWorkplaces.profileId)),
          ),
          tx
            .with(allCurrentWorkplaces, allPreferredWorkplaces, ctePairs)
            .select({ acw, apw })
            .from(ctePairs)
            .innerJoin(
              allCurrentWorkplaces,
              eq(allCurrentWorkplaces.profileId, ctePairs.preferredProfileId),
            )
            .innerJoin(
              allPreferredWorkplaces,
              and(
                eq(allPreferredWorkplaces.profileId, ctePairs.currentProfileId),
                ST_DWithin(allCurrentWorkplaces.geom, allPreferredWorkplaces.geom, km50),
              ),
            ),
        ])

        const allWorkplaces = pairs.flatMap(({ acw, apw }) => [acw, apw]).concat(myWorkPlaces)
        const uniqueWorkplaces = allWorkplaces.reduce(
          (acc, loc) => acc.set(loc.profileId + loc.addressId, loc as any),
          new Map<string, RemoveNullable<(typeof myWorkPlaces)[number]>>(),
        )

        return Array.from(uniqueWorkplaces.values())
      })
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
          const [{ profileId }, { addressId }] = await Promise.all([
            // exchange authId with profileId
            tx
              .select({ profileId: schema.profile.id })
              .from(schema.profile)
              .where(eq(schema.profile.createdBy, authUserId))
              .then(ensureSingleRow),
            tx
              .insert(schema.address)
              .values({
                text: input.text,
                latitude: input.latitude,
                longitude: input.longitude,
              })
              .returning({ addressId: schema.address.id })
              .then(ensureSingleRow),
          ])
          await tx.insert(schema.profileAddress).values({ profileId, addressId, type: input.type })
          return addressId
        })
      }),
    update: protectedProcedure
      .input(
        z.object({
          addressId: z.string(),
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
