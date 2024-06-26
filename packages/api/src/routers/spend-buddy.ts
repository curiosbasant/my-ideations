import { and, count, desc, eq, lt, schema, sql, sum, unionAll, type Database } from '@my/db'
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
            ownerId: schema.group.createdBy,
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
          ownerId: myGroups.ownerId,
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
    spend: {
      all: protectedProcedure
        .input(
          z.object({
            groupId: z.string(),
            cursor: z.date().nullish(),
            limit: z.number().min(1).max(50).default(15),
          }),
        )
        .query(async ({ ctx: { db }, input }) => {
          const rows = await db
            .select({
              id: schema.spend.id,
              amount: sql<number>`${schema.spend.amount} / 100`.as('amount_rupee'),
              note: schema.spend.note,
              createdAt: schema.spend.createdAt,
              user: {
                id: schema.profile.id,
                displayName: userDisplayName,
                avatarUrl: schema.profile.avatarUrl,
              },
            })
            .from(schema.spend)
            .innerJoin(schema.profile, eq(schema.profile.id, schema.spend.createdBy))
            .where(
              and(
                eq(schema.spend.groupId, input.groupId),
                input.cursor ? lt(schema.spend.createdAt, input.cursor) : undefined,
              ),
            )
            .orderBy(desc(schema.spend.createdAt))
            .limit(input.limit)

          return {
            items: rows,
            nextCursor: rows.length === input.limit ? rows.at(-1)?.createdAt : null,
          }
        }),
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

        const rows = await db
          .select({
            id: schema.profile.id,
            displayName: userDisplayName,
            avatarUrl: schema.profile.avatarUrl,
            joinedAt: schema.member.joinedAt,
            spends: sql<string>`coalesce(${memberSpends.spends} / 100, 0)`.as('total_spends'),
          })
          .from(schema.member)
          .innerJoin(schema.profile, eq(schema.profile.id, schema.member.userId))
          .innerJoin(memberSpends, eq(memberSpends.id, schema.member.userId))
          .where(eq(schema.member.groupId, input))
          .orderBy(desc(schema.member.joinedAt))

        return rows
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
  notification: {
    all: protectedProcedure
      .input(
        z.object({
          cursor: z.date().nullish(),
          limit: z.number().min(1).max(50).default(15),
        }),
      )
      .query(async ({ ctx: { db, authUserId }, input }) => {
        const query = db
          .select({
            id: schema.notification.id,
            type: schema.notification.type,
            read: schema.notification.read,
            resourceId: schema.notification.resourceId,
            createdAt: schema.notification.createdAt,
            user: {
              displayName: userDisplayName,
              avatarUrl: schema.profile.avatarUrl,
            },
          })
          .from(schema.notification)
          .innerJoin(schema.profile, eq(schema.profile.id, schema.notification.createdBy))
          .where(eq(schema.notification.userId, authUserId))
          .as('user_notifications')

        const rows = await unionAll(
          db
            .select({
              id: query.id,
              type: query.type,
              read: query.read,
              resourceId: query.resourceId,
              createdAt: query.createdAt,
              user: {
                displayName: query.user.displayName,
                avatarUrl: query.user.avatarUrl,
              },
              spend: {
                id: schema.spend.id,
                amount: sql<number>`${schema.spend.amount} / 100`.as('amount_rupee'),
              },
              member: {
                id: sql<string>`${null}`,
                displayName: sql<string>`${null}`,
                avatarUrl: sql<string | null>`${null}`,
              },
              group: {
                id: schema.group.id,
                name: schema.group.name,
              },
            })
            .from(query)
            .innerJoin(schema.spend, eq(schema.spend.id, query.resourceId))
            .innerJoin(schema.group, eq(schema.group.id, schema.spend.groupId))
            .where(eq(query.type, 'group_spend_add')),
          db
            .select({
              id: query.id,
              type: query.type,
              read: query.read,
              resourceId: query.resourceId,
              createdAt: query.createdAt,
              user: {
                displayName: query.user.displayName,
                avatarUrl: query.user.avatarUrl,
              },
              spend: {
                id: sql<string>`${null}`,
                amount: sql<number>`${null}`,
              },
              member: {
                id: schema.profile.id,
                displayName: userDisplayName,
                avatarUrl: schema.profile.avatarUrl,
              },
              group: {
                id: schema.group.id,
                name: schema.group.name,
              },
            })
            .from(query)
            .innerJoin(schema.member, eq(schema.member.userId, sql`${query.resourceId}::uuid`))
            .innerJoin(schema.profile, eq(schema.profile.id, schema.member.userId))
            .innerJoin(schema.group, eq(schema.group.id, schema.member.groupId))
            .where(
              and(
                lt(query.createdAt, input.cursor!).if(input.cursor),
                eq(query.type, 'group_member_add'),
              ),
            ),
        )
          .orderBy(desc(query.createdAt))
          .limit(input.limit)

        return {
          items: rows,
          nextCursor: rows.length === input.limit ? rows.at(-1)?.createdAt : null,
        }
      }),
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
