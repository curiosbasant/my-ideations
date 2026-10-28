import { TRPCError } from '@trpc/server'

import { schema } from '@my/db'
import { selectProfileId, selectUserId, userProfileId } from '@my/db/db-functions'
import { profileDisplayName } from '@my/db/helpers'
import { and, desc, eq, isNull, now } from '@my/db/sql'
import { placeIdToLocation } from '@my/lib/maps'
import { z } from '@my/lib/zod'

import { protectedProcedure, publicProcedure } from '../../trpc'
import { adminRouter } from './admin'
import { profileRouter } from './profile'

export const userRouter = {
  admin: adminRouter,
  profile: profileRouter,

  get: protectedProcedure.query(({ ctx: { rls } }) => {
    return rls(async (tx) => {
      const [user] = await tx
        .select({
          id: schema.profile.id,
          displayName: profileDisplayName().as('display_name'),
          avatarUrl: schema.profile.avatarUrl,
          designation: schema.designation,
          personId: schema.profile.personId,
        })
        .from(schema.profile)
        .leftJoin(schema.designation, eq(schema.designation.id, schema.profile.postId))
        .where(eq(schema.profile.createdBy, selectUserId))
      if (user) return user

      throw new TRPCError({ code: 'NOT_FOUND' })
    })
  }),

  department: {
    list: publicProcedure.query(async ({ ctx: { rls } }) => {
      return rls((tx) => tx.select().from(schema.department))
    }),
    update: protectedProcedure
      .input(z.object({ departmentId: z.string(), designation: z.string() }))
      .mutation(async ({ ctx: { rls }, input }) => {
        return rls(async (tx) => {
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
              .where(eq(schema.profile.createdBy, selectUserId))
          } else {
            await tx
              .update(schema.profile)
              .set({ postId: schema.designation.id })
              .from(schema.designation)
              .where(
                and(
                  eq(schema.profile.createdBy, selectUserId),
                  eq(schema.designation.departmentId, input.departmentId),
                  eq(schema.designation.name, input.designation),
                ),
              )
          }
        })
      }),

    designation: {
      list: publicProcedure
        .input(z.object({ departmentId: z.string() }))
        .query(async ({ ctx: { rls }, input }) => {
          return rls((tx) =>
            tx
              .select({
                id: schema.designation.id,
                name: schema.designation.name,
                count: tx.$count(schema.profile, eq(schema.profile.postId, schema.designation.id)),
              })
              .from(schema.designation)
              .where(eq(schema.designation.departmentId, input.departmentId)),
          )
        }),
    },
  },
  address: {
    get: protectedProcedure.query(({ ctx: { rls } }) => {
      return rls(async (tx) => {
        const [address] = await tx
          .select({
            placeId: schema.address.id,
            addressText: schema.address.text,
            addressSecondaryText: schema.address.secondaryText,
          })
          .from(schema.profileAddress)
          .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
          .where(
            and(
              isNull(schema.profileAddress.type),
              eq(schema.profileAddress.profileId, selectProfileId),
            ),
          )
          .orderBy(desc(schema.profileAddress.updatedAt)) // only take the latest address
          .limit(1)

        return address ?? null
      })
    }),
    upsert: protectedProcedure
      .input(
        z.object({
          placeId: z.string(),
          text: z.string(),
          secondaryText: z.string().nullish(),
        }),
      )
      .mutation(async ({ ctx: { rls }, input }) => {
        return rls(async (tx) => {
          async function ensureAddressIdByPlaceId() {
            const [row] = await tx
              .select({ addressId: schema.address.id })
              .from(schema.address)
              .where(eq(schema.address.placeId, input.placeId))
            if (row?.addressId) return row.addressId

            const location = await placeIdToLocation(input.placeId)
            const [insertedRow] = await tx
              .insert(schema.address)
              .values({
                placeId: input.placeId,
                text: input.text,
                secondaryText: input.secondaryText,
                latitude: location.latitude,
                longitude: location.longitude,
              })
              .returning({ addressId: schema.address.id })
            if (insertedRow?.addressId) return insertedRow.addressId

            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
          }

          const addressId = await ensureAddressIdByPlaceId()

          // link profile with address
          await tx
            .insert(schema.profileAddress)
            .values({
              profileId: userProfileId,
              addressId,
            })
            .onConflictDoUpdate({
              target: [schema.profileAddress.profileId, schema.profileAddress.addressId],
              set: { updatedAt: now() },
            })
        })
      }),
  },
}
