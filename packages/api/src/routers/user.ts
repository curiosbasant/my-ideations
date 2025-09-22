import { and, desc, eq, schema, sql } from '@my/db'
import { placeIdToLocation } from '@my/lib/maps'
import { z } from '@my/lib/zod'

import { userDisplayName } from '../lib/utils'
import { protectedProcedure, publicProcedure } from '../trpc'

export const userRouter = {
  get: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
    const [user] = await db
      .select({
        id: schema.profile.id,
        displayName: userDisplayName,
        avatarUrl: schema.profile.avatarUrl,
        designation: schema.designation,
      })
      .from(schema.profile)
      .leftJoin(schema.designation, eq(schema.designation.id, schema.profile.postId))
      .where(eq(schema.profile.createdBy, authUserId))

    return user
  }),

  department: {
    list: publicProcedure.query(async ({ ctx: { db } }) => {
      return db.select().from(schema.department)
    }),
    update: protectedProcedure
      .input(z.object({ departmentId: z.coerce.number(), designation: z.string() }))
      .mutation(async ({ ctx: { db, authUserId }, input }) => {
        db.transaction(async (tx) => {
          const [insertedRow] = await tx
            .insert(schema.designation)
            .values({
              departmentId: input.departmentId,
              name: input.designation,
            })
            .returning({ postId: schema.designation.id })
            .onConflictDoNothing()

          if (insertedRow?.postId) {
            await tx
              .update(schema.profile)
              .set({ postId: insertedRow.postId })
              .where(eq(schema.profile.createdBy, authUserId))
          } else {
            await tx
              .update(schema.profile)
              .set({ postId: schema.designation.id })
              .from(schema.designation)
              .where(
                and(
                  eq(schema.profile.createdBy, authUserId),
                  eq(schema.designation.departmentId, input.departmentId),
                  eq(schema.designation.name, input.designation),
                ),
              )
          }
        })
      }),

    designation: {
      list: publicProcedure
        .input(z.object({ departmentId: z.coerce.number() }))
        .query(async ({ ctx: { db }, input }) => {
          return db
            .select({
              id: schema.designation.id,
              name: schema.designation.name,
              count: db.$count(schema.profile, eq(schema.profile.postId, schema.designation.id)),
            })
            .from(schema.designation)
            .where(eq(schema.designation.departmentId, input.departmentId))
        }),
    },
  },
  address: {
    get: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      const [address] = await db
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
            eq(schema.profileAddress.type, 'current-workplace'),
            eq(schema.profile.createdBy, authUserId),
          ),
        )
        .orderBy(desc(schema.profileAddress.updatedAt)) // only take the latest address
        .limit(1)

      return address || null
    }),
    upsert: protectedProcedure
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
              type: 'current-workplace',
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
