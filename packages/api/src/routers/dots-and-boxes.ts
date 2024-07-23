import { eq, schema, sql } from '@my/db'
import { z } from '@my/lib/zod'

import { anonymousProcedure, protectedProcedure, publicProcedure } from '../trpc'

export const dotsAndBoxesRouter = {
  get: publicProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.board.findFirst({
        where: eq(schema.board.id, input.boardId),
      })
    }),
  create: anonymousProcedure
    .input(z.object({ rows: z.number(), cols: z.number() }))
    .mutation(({ ctx: { db, authUserId }, input }) => {
      return db.transaction(async (tx) => {
        const [board] = await tx
          .insert(schema.board)
          .values({
            rows: input.rows,
            cols: input.cols,
            players: [authUserId],
            createdBy: authUserId,
          })
          .returning({ id: schema.board.id })

        return board
      })
    }),
  join: anonymousProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(async ({ ctx: { db, authUserId }, input }) => {
      return await db
        .update(schema.board)
        .set({
          players: sql`${schema.board.players} || ${authUserId}::uuid`,
          // players: sql`array_append(${schema.board.players}, ${authUserId})`,
        })
        .where(eq(schema.board.id, input.boardId))
      return db.transaction(async (tx) => {
        const [board] = await tx
          .select({ players: schema.board.players })
          .from(schema.board)
          .where(eq(schema.board.id, input.boardId))

        await tx.update(schema.board).set({
          players: [...board.players, authUserId],
        })
      })
    }),
  start: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      await db
        .update(schema.board)
        .set({
          status: 'playing',
          activePlayerIndex: sql`random() * cardinality(${schema.board.players})`,
        })
        .where(eq(schema.board.id, input.boardId))
    }),
  move: protectedProcedure
    .input(z.object({ boardId: z.string(), dashName: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      return db.transaction(async (tx) => {
        const [board] = await tx
          .select({
            activePlayerIndex: schema.board.activePlayerIndex,
            dashes: schema.board.dashes,
          })
          .from(schema.board)
          .where(eq(schema.board.id, input.boardId))

        await tx
          .update(schema.board)
          .set({
            activePlayerIndex: sql`mod(${schema.board.activePlayerIndex} + 1, cardinality(${schema.board.players}))`,
            dashes: { ...board.dashes, [input.dashName]: board.activePlayerIndex ?? 0 },
          })
          .where(eq(schema.board.id, input.boardId))
      })
    }),
}
