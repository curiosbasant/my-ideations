import { count, eq, schema, sql } from '@my/db'
import { groupCreateSchema } from '@my/lib/schema/spend-buddy'

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
            .returning({ id: schema.group.id })

          await tx.insert(schema.member).values({
            groupId: group.id,
            userId: authUserId,
          })

          return group
        })

        return data
      }),
  },
}
