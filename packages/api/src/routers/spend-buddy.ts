import { and, count, desc, eq, schema, sql, sum, type Database } from '@my/db'
import {
  groupCreateSchema,
  groupMemberInviteSchema,
  groupSpendCreateSchema,
} from '@my/lib/schema/spend-buddy'
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

      const groupSpends = db
        .select({
          id: schema.group.id,
          spends: sum(schema.spend.amount).as('spends'),
        })
        .from(schema.spend)
        .innerJoin(schema.group, eq(schema.group.id, schema.spend.groupId))
        .groupBy(schema.group.id)
        .as('group_spends')

      const groupMemberCount = db
        .select({
          id: schema.group.id,
          count: count().as('member_count'),
        })
        .from(schema.member)
        .innerJoin(schema.group, eq(schema.group.id, schema.member.groupId))
        .groupBy(schema.group.id)
        .as('group_member_count')

      const rows = await db
        .with(myGroups)
        .select({
          id: myGroups.id,
          name: myGroups.name,
          memberCount: groupMemberCount.count,
          totalSpends: sql<string>`coalesce(${groupSpends.spends} / 100, 0)`.as('total_spends'),
        })
        .from(myGroups)
        .leftJoin(groupMemberCount, eq(myGroups.id, groupMemberCount.id))
        .leftJoin(groupSpends, eq(myGroups.id, groupSpends.id))

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
        const memberSpends = db
          .select({
            id: schema.spend.createdBy,
            spends: sum(schema.spend.amount).as('spends'),
          })
          .from(schema.spend)
          .where(eq(schema.spend.groupId, input))
          .groupBy(schema.spend.createdBy)
          .as('member_spends')

        return await db
          .select({
            id: schema.profile.id,
            displayName: userDisplayName,
            avatarUrl: schema.profile.avatarUrl,
            joinedAt: schema.member.joinedAt,
            spends: sql<string>`coalesce(${memberSpends.spends} / 100, 0)`.as('total_spends'),
          })
          .from(schema.member)
          .innerJoin(schema.group, eq(schema.group.id, schema.member.groupId))
          .innerJoin(schema.profile, eq(schema.profile.id, schema.member.userId))
          .innerJoin(memberSpends, eq(memberSpends.id, schema.member.userId))
          .where(eq(schema.group.id, input))
          .orderBy(desc(schema.member.joinedAt))
      }),
      invite: protectedProcedure
        .input(groupMemberInviteSchema)
        .mutation(async ({ ctx: { db }, input }) => {
          const userId = await resolveUserId(db, input.userIdentity)
          if (!userId) {
            return {
              success: false,
            }
          }
          await db.insert(schema.member).values({
            groupId: input.groupId,
            userId,
          })

          return {
            success: true,
          }
        }),
    },
  },
}

async function resolveUserId(db: Database, userIdentity: string) {
  if (!userIdentity.includes('@')) return userIdentity

  const [row] = await db
    .select({ id: schema.profile.id })
    .from(schema.profile)
    .where(eq(schema.profile.email, userIdentity))

  if (!row?.id) return null
  // TODO: handle sending user email about the invite
  return row.id
}
