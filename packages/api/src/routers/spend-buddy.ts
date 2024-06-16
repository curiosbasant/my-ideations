import { and, count, desc, eq, schema, sql } from '@my/db'
import { groupCreateSchema } from '@my/lib/schema/spend-buddy'
import { z } from '@my/lib/zod'

import { userDisplayName } from '../lib/utils'
import { protectedProcedure } from '../trpc'

export const spendBuddyRouter = {
  group: {
    all: protectedProcedure.query(async ({ ctx: { db, authUserId }, input }) => {
      const rows = await db
        .select({
          id: schema.group.id,
          name: schema.group.name,
          totalSpends: sql<number>`sum(${schema.spend.amount}) / 100`.as('total_spends'),
          memberCount: count(schema.member.groupId),
        })
        .from(schema.member)
        .innerJoin(schema.group, eq(schema.group.id, schema.member.groupId))
        .leftJoin(schema.spend, eq(schema.group.id, schema.spend.groupId))
        .groupBy(schema.group.id)
        .where(eq(schema.member.userId, authUserId))

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
  },
}
