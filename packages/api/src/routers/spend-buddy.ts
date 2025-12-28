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
    all: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      const myGroups = db.$with('my_groups').as(
        db
          .select({
            id: schema.sb__group.id,
            name: schema.sb__group.name,
            ownerId: schema.sb__group.createdBy,
          })
          .from(schema.sb__member)
          .innerJoin(schema.sb__group, eq(schema.sb__group.id, schema.sb__member.groupId))
          .innerJoin(schema.profile, eq(schema.profile.id, schema.sb__member.userId))
          .where(eq(schema.profile.createdBy, authUserId)),
      )

      const groupSpends = db
        .select({
          id: schema.sb__group.id,
          spends: sum(schema.sb__spend.amount).as('spends'),
        })
        .from(schema.sb__spend)
        .innerJoin(schema.sb__group, eq(schema.sb__group.id, schema.sb__spend.groupId))
        .groupBy(schema.sb__group.id)
        .as('group_spends')

      const groupMemberCount = db
        .select({
          id: schema.sb__group.id,
          count: count().as('member_count'),
        })
        .from(schema.sb__member)
        .innerJoin(schema.sb__group, eq(schema.sb__group.id, schema.sb__member.groupId))
        .groupBy(schema.sb__group.id)
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
          const toProfileId = tx
            .$with('pid')
            .as((qb) =>
              qb
                .select({ profileId: schema.profile.id })
                .from(schema.profile)
                .where(eq(schema.profile.createdBy, authUserId)),
            )
          const [group] = await tx
            .insert(schema.sb__group)
            .values({
              name: input.name,
              createdBy: sql`(select * from ${toProfileId})`,
            })
            .returning({
              id: schema.sb__group.id,
              name: schema.sb__group.name,
              profileId: schema.sb__group.createdBy,
            })

          await tx.insert(schema.sb__member).values({
            groupId: group.id,
            userId: group.profileId,
          })

          return group
        })

        return data
      }),
    spend: {
      all: protectedProcedure
        .input(
          z.object({
            groupId: z.coerce.number(),
            cursor: z.date().nullish(),
            limit: z.number().min(1).max(50).default(15),
          }),
        )
        .query(async ({ ctx: { db }, input }) => {
          const rows = await db
            .select({
              id: schema.sb__spend.id,
              amount: sql<number>`${schema.sb__spend.amount} / 100`.as('amount_rupee'),
              note: schema.sb__spend.note,
              createdAt: schema.sb__spend.createdAt,
              user: {
                id: schema.profile.id,
                displayName: userDisplayName,
                avatarUrl: schema.profile.avatarUrl,
              },
            })
            .from(schema.sb__spend)
            .innerJoin(schema.profile, eq(schema.profile.id, schema.sb__spend.createdBy))
            .where(
              and(
                eq(schema.sb__spend.groupId, input.groupId),
                input.cursor ? lt(schema.sb__spend.createdAt, input.cursor) : undefined,
              ),
            )
            .orderBy(desc(schema.sb__spend.createdAt))
            .limit(input.limit)

          return {
            items: rows,
            nextCursor: rows.length === input.limit ? rows.at(-1)?.createdAt : null,
          }
        }),
      create: protectedProcedure
        .input(groupSpendCreateSchema)
        .mutation(async ({ ctx: { db, authUserId }, input }) => {
          const toProfileId = db
            .$with('pid')
            .as((qb) =>
              qb
                .select({ profileId: schema.profile.id })
                .from(schema.profile)
                .where(eq(schema.profile.createdBy, authUserId)),
            )
          const [spend] = await db
            .with(toProfileId)
            .insert(schema.sb__spend)
            .values({
              groupId: input.groupId,
              amount: input.amount * 100,
              note: input.note,
              createdBy: sql`(select * from ${toProfileId})`,
            })
            .returning({ id: schema.sb__spend.id })

          return spend
        }),
    },
    member: {
      all: protectedProcedure.input(z.coerce.number()).query(async ({ ctx: { db }, input }) => {
        const memberSpends = db
          .select({
            id: schema.sb__spend.createdBy,
            spends: sum(schema.sb__spend.amount).as('spends'),
          })
          .from(schema.sb__spend)
          .where(eq(schema.sb__spend.groupId, input))
          .groupBy(schema.sb__spend.createdBy)
          .as('member_spends')

        const rows = await db
          .select({
            id: schema.profile.id,
            displayName: userDisplayName,
            avatarUrl: schema.profile.avatarUrl,
            joinedAt: schema.sb__member.joinedAt,
            spends: sql<string>`coalesce(${memberSpends.spends} / 100, 0)`.as('total_spends'),
          })
          .from(schema.sb__member)
          .innerJoin(schema.profile, eq(schema.profile.id, schema.sb__member.userId))
          .leftJoin(memberSpends, eq(memberSpends.id, schema.sb__member.userId))
          .where(eq(schema.sb__member.groupId, input))
          .orderBy(desc(schema.sb__member.joinedAt))

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
          await db.insert(schema.sb__member).values({
            groupId: input.groupId,
            userId: Number(userId),
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
        const toProfileId = db
          .$with('pid')
          .as((qb) =>
            qb
              .select({ profileId: schema.profile.id })
              .from(schema.profile)
              .where(eq(schema.profile.createdBy, authUserId)),
          )
        const query = db
          .select({
            id: schema.sb__notification.id,
            type: schema.sb__notification.type,
            read: schema.sb__notification.read,
            resourceId: schema.sb__notification.resourceId,
            createdAt: schema.sb__notification.createdAt,
            user: {
              displayName: userDisplayName,
              avatarUrl: schema.profile.avatarUrl,
            },
          })
          .from(schema.sb__notification)
          .innerJoin(schema.profile, eq(schema.profile.id, schema.sb__notification.createdBy))
          .where(eq(schema.sb__notification.userId, sql`(select * from ${toProfileId})`))
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
                id: schema.sb__spend.id,
                amount: sql<number>`${schema.sb__spend.amount} / 100`.as('amount_rupee'),
              },
              member: {
                id: sql<number>`${null}`,
                displayName: sql<string>`${null}`,
                avatarUrl: sql<string | null>`${null}`,
              },
              group: {
                id: schema.sb__group.id,
                name: schema.sb__group.name,
              },
            })
            .from(query)
            .innerJoin(schema.sb__spend, eq(schema.sb__spend.id, query.resourceId))
            .innerJoin(schema.sb__group, eq(schema.sb__group.id, schema.sb__spend.groupId))
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
                id: sql<number>`${null}`,
                amount: sql<number>`${null}`,
              },
              member: {
                id: schema.profile.id,
                displayName: userDisplayName,
                avatarUrl: schema.profile.avatarUrl,
              },
              group: {
                id: schema.sb__group.id,
                name: schema.sb__group.name,
              },
            })
            .from(query)
            .innerJoin(schema.sb__member, eq(schema.sb__member.userId, query.resourceId))
            .innerJoin(schema.profile, eq(schema.profile.id, schema.sb__member.userId))
            .innerJoin(schema.sb__group, eq(schema.sb__group.id, schema.sb__member.groupId))
            .where(
              and(
                lt(query.createdAt, input.cursor!).if(input.cursor),
                eq(query.type, 'group_member_join'),
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
    mark: protectedProcedure
      .input(
        z.object({
          notificationId: z.coerce.number(),
          read: z.boolean().default(true),
        }),
      )
      .mutation(async ({ ctx: { db }, input }) => {
        await db
          .update(schema.sb__notification)
          .set({
            read: input.read,
          })
          .where(eq(schema.sb__notification.id, input.notificationId))
      }),
    unread: protectedProcedure.query(async ({ ctx: { db, authUserId } }) => {
      const [row] = await db
        .select({ count: count().as('unread_notifications_count') })
        .from(schema.sb__notification)
        .innerJoin(schema.profile, eq(schema.profile.id, schema.sb__notification.userId))
        .where(
          and(eq(schema.profile.createdBy, authUserId), eq(schema.sb__notification.read, false)),
        )
      return row
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
