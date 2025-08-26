import { eq, schema, sql } from '@my/db'
import { z } from '@my/lib/zod'

import { anonymousProcedure, protectedProcedure, publicProcedure } from '../trpc'

export const dotsAndBoxesRouter = {
  get: publicProcedure
    .input(z.object({ boardId: z.coerce.number() }))
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.gdb__board.findFirst({
        where: eq(schema.gdb__board.id, input.boardId),
      })
    }),
  create: anonymousProcedure
    .input(z.object({ rows: z.number(), cols: z.number() }))
    .mutation(({ ctx: { db, authUserId }, input }) => {
      return db.transaction(async (tx) => {
        const [board] = await tx
          .insert(schema.gdb__board)
          .values({
            rows: input.rows,
            cols: input.cols,
            players: [authUserId],
            createdBy: authUserId,
          })
          .returning({ id: schema.gdb__board.id })

        return board
      })
    }),
  join: anonymousProcedure
    .input(z.object({ boardId: z.coerce.number() }))
    .mutation(async ({ ctx: { db, authUserId }, input }) => {
      return await db
        .update(schema.gdb__board)
        .set({
          players: sql`${schema.gdb__board.players} || ${authUserId}::uuid`,
          // players: sql`array_append(${schema.gdb__board.players}, ${authUserId})`,
        })
        .where(eq(schema.gdb__board.id, input.boardId))
      return db.transaction(async (tx) => {
        const [board] = await tx
          .select({ players: schema.gdb__board.players })
          .from(schema.gdb__board)
          .where(eq(schema.gdb__board.id, input.boardId))

        await tx.update(schema.gdb__board).set({
          players: [...board.players, authUserId],
        })
      })
    }),
  start: protectedProcedure
    .input(z.object({ boardId: z.coerce.number() }))
    .mutation(async ({ ctx: { db }, input }) => {
      await db
        .update(schema.gdb__board)
        .set({
          status: 'playing',
          activePlayerIndex: sql`random() * cardinality(${schema.gdb__board.players})`,
        })
        .where(eq(schema.gdb__board.id, input.boardId))
    }),
  move: protectedProcedure
    .input(z.object({ boardId: z.coerce.number(), dashName: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      return db.transaction(async (tx) => {
        const [board] = await tx
          .select({
            activePlayerIndex: schema.gdb__board.activePlayerIndex,
            dashes: schema.gdb__board.dashes,
          })
          .from(schema.gdb__board)
          .where(eq(schema.gdb__board.id, input.boardId))

        await tx
          .update(schema.gdb__board)
          .set({
            activePlayerIndex: sql`mod(${schema.gdb__board.activePlayerIndex} + 1, cardinality(${schema.gdb__board.players}))`,
            dashes: { ...board.dashes, [input.dashName]: board.activePlayerIndex ?? 0 },
          })
          .where(eq(schema.gdb__board.id, input.boardId))
      })
    }),
}
