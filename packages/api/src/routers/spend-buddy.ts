import { and, countDistinct, desc, eq, schema, sql } from '@my/db'
import { groupCreateSchema, groupSpendCreateSchema } from '@my/lib/schema/spend-buddy'
import { z } from '@my/lib/zod'

import { userDisplayName } from '../lib/utils'
import { protectedProcedure } from '../trpc'

export const spendBuddyRouter = {
  group: {
    all: protectedProcedure.query(async ({ ctx: { db, authUserId }, input }) => {
      const myGroups = db.$with('my_groups').as(
        db
          .select({
            id: schema.group.id,
            name: schema.group.name,
          })
          .from(schema.member)
          .innerJoin(schema.group, eq(schema.group.id, schema.member.groupId))
          .where(eq(schema.member.userId, authUserId)),
      )
      const groupData = db.$with('group_data').as(
        db
          .with(myGroups)
          .select({
            id: myGroups.id,
            totalSpends: sql<string>`coalesce(sum(${schema.spend.amount}) / 100, 0)`.as(
              'total_spends',
            ),
            memberCount: countDistinct(schema.member.userId).as('member_count'),
          })
          .from(schema.member)
          .innerJoin(myGroups, eq(myGroups.id, schema.member.groupId))
          .leftJoin(schema.spend, eq(myGroups.id, schema.spend.groupId))
          .groupBy(myGroups.id),
      )

      const rows = await db
        .with(myGroups, groupData)
        .select({
          id: myGroups.id,
          name: myGroups.name,
          totalSpends: groupData.totalSpends,
          memberCount: groupData.memberCount,
        })
        .from(groupData)
        .innerJoin(myGroups, eq(groupData.id, myGroups.id))

      return rows
    }),
    create: protectedProcedure
      .input(groupCreateSchema)
      .mutation(async ({ ctx: { db, authUserId }, input }) => {
        const data = await db.transaction(async (tx) => {
          const [group] = await tx
            .insert(schema.group)
            .values({
              name: input.name,
              createdBy: authUserId,
            })
            .returning({ id: schema.group.id, name: schema.group.name })

          await tx.insert(schema.member).values({
            groupId: group.id,
            userId: authUserId,
          })

          return group
        })

        return data
      }),
    get: protectedProcedure.input(z.string()).query(async ({ ctx: { db, authUserId }, input }) => {
      const rows = await db
        .select({
          id: schema.group.id,
          name: schema.group.name,
          ownerId: schema.group.createdBy,
          spend: {
            id: schema.spend.id,
            amount: sql<number>`${schema.spend.amount} / 100`.as('amount_rupee'),
            note: schema.spend.note,
            createdAt: schema.spend.createdAt,
          },
          spendUser: {
            id: schema.profile.id,
            displayName: userDisplayName,
            avatarUrl: schema.profile.avatarUrl,
          },
        })
        .from(schema.member)
        .innerJoin(schema.group, eq(schema.group.id, schema.member.groupId))
        .leftJoin(schema.spend, eq(schema.group.id, schema.spend.groupId))
        .leftJoin(schema.profile, eq(schema.spend.createdBy, schema.profile.id))
        .where(and(eq(schema.member.groupId, input), eq(schema.member.userId, authUserId)))
        .orderBy(desc(schema.spend.createdAt))

      const { spend, spendUser, ...fg } = rows[0]
      const group = {
        ...fg,
        spends: spend ? rows.map((g) => ({ ...g.spend!, user: g.spendUser! })) : [],
      }

      return group
    }),
    spend: {
      create: protectedProcedure
        .input(groupSpendCreateSchema)
        .mutation(async ({ ctx: { db, authUserId }, input }) => {
          const [spend] = await db
            .insert(schema.spend)
            .values({
              groupId: input.groupId,
              amount: input.amount * 100,
              note: input.note,
              createdBy: authUserId,
            })
            .returning({ id: schema.spend.id })

          return spend
        }),
    },
    member: {
      all: protectedProcedure.input(z.string()).query(async ({ ctx: { db }, input }) => {
        return await db
          .select({
            id: schema.profile.id,
            displayName: userDisplayName,
            avatarUrl: schema.profile.avatarUrl,
            joinedAt: schema.member.joinedAt,
          })
          .from(schema.member)
          .innerJoin(schema.group, eq(schema.group.id, schema.member.groupId))
          .innerJoin(schema.profile, eq(schema.profile.id, schema.member.userId))
          .where(eq(schema.group.id, input))
          .orderBy(desc(schema.member.joinedAt))
      }),
    },
  },
}
