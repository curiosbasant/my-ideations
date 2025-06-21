import { TRPCError } from '@trpc/server'
import { ServerValue } from 'firebase-admin/database'
import z from 'zod'

import { database } from '~/utils/firebase.server'
import { generateId } from '~/utils/general.util'
import { publicProcedure, router } from '../trpc'

type Game = {
  config: {
    rows: number
    cols: number
  }
  players: {
    id: string
    displayName: string
  }[]
  activePlayerIndex: number
  dashes: Record<string | number, number>
  boxes: Record<string | number, number>
  status: 'waiting' | 'running' | 'finished'
}

const schema = z.object({
  config: z.object({
    rows: z.number(),
    cols: z.number(),
  }),
  players: z
    .object({
      id: z.string(),
      displayName: z.string(),
      kicked: z.boolean().default(false),
    })
    .array(),
  activePlayerIndex: z.number(),
  boxes: z.record(z.string(), z.number()).default({}),
  dashes: z.record(z.string(), z.number()).default({}),
  status: z.enum(['waiting', 'running', 'finished']),
})

const dotsAndBoxesRef = database.ref('apps/games/dotsAndBoxes')

export default router({
  createNew: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        playerName: z.string().nullish(),
        rows: z.number().positive().lte(20).default(7),
        cols: z.number().positive().lte(20).default(10),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const gameId = generateId(4)
      await database
        .ref('apps/games/dotsAndBoxes')
        .child(gameId)
        .set({
          config: { rows: input.rows, cols: input.cols },
          players: [
            {
              id: input.playerId,
              displayName: input.playerName || `Guest${input.playerId.slice(0, 4)}`,
            },
          ],
          activePlayerIndex: -1,

          status: 'waiting',
          timestamp: ServerValue.TIMESTAMP,
        })

      return gameId
    }),

  join: publicProcedure
    .input(
      z.object({
        gameId: z.string(),
        playerId: z.string(),
        playerName: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await dotsAndBoxesRef.child(input.gameId).transaction((game: Game) => {
        if (!game) throw new TRPCError({ code: 'NOT_FOUND' })

        if (game.status !== 'waiting')
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Game is either already started or has finished!',
          })
        if (game.players.some((p) => p.id === input.playerId))
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Already joined the game!',
          })
        if (game.players.length > 3)
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: "Don't have any slots!",
          })

        return {
          ...game,
          players: [
            ...game.players,
            {
              id: input.playerId,
              displayName: input.playerName || `Guest${input.playerId.slice(0, 4)}`,
            },
          ],
        }
      })

      return {
        success: true,
      }
    }),

  start: publicProcedure
    .input(
      z.object({
        gameId: z.string(),
        playerId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await dotsAndBoxesRef.child(input.gameId).transaction((game: Game) => {
        if (!game) throw new TRPCError({ code: 'NOT_FOUND' })

        if (game.status !== 'waiting')
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Game has either already started or has finished!',
          })
        if (game.players[0].id !== input.playerId)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Only game operators can start the game!',
          })
        if (game.players.length < 2)
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not enough players to start the game.',
          })

        return {
          ...game,
          status: 'running',
          activePlayerIndex: (Math.random() * game.players.length) | 0,
        }
      })

      return {
        success: true,
      }
    }),

  makeMove: publicProcedure
    .input(
      z.object({
        gameId: z.string(),
        playerId: z.string(),
        dashName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await dotsAndBoxesRef.child(input.gameId).transaction((game: Game) => {
        if (!game) throw new TRPCError({ code: 'NOT_FOUND' })

        if (game.status !== 'running')
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Game is not in progress!',
          })
        if (!game.players.some((p) => p.id === input.playerId))
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: "You're not a part of this game.",
          })
        if (game.players[game.activePlayerIndex].id !== input.playerId)
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: "It's not your turn.",
          })

        // a is always less than b
        const [firstDotPosition, secondDotPosition] = input.dashName.split('_').map(Number)
        if (
          isNaN(firstDotPosition)
          || isNaN(secondDotPosition)
          || firstDotPosition >= secondDotPosition
        )
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Invalid Move!',
          })

        if (!game.dashes) {
          return {
            ...game,
            activePlayerIndex: game.activePlayerIndex + 1,
            dashes: { [input.dashName]: game.activePlayerIndex },
            lastDash: input.dashName,
          }
        } else if (input.dashName in game.dashes)
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Space already occupied!',
          })

        const toUpdate = {
          ...game,
          dashes: {
            ...game.dashes,
            [input.dashName]: game.activePlayerIndex,
          },
          boxes: game.boxes || {},
          activePlayerIndex: (game.activePlayerIndex + 1) % game.players.length,
          lastDash: input.dashName,
        }

        if (
          Object.keys(game.dashes).length + 1
          === game.config.rows * game.config.cols * 2 + game.config.rows + game.config.cols
        ) {
          toUpdate.status = 'finished'
        }

        const isHorizontal = secondDotPosition - firstDotPosition == 1
        const dotsColumnCount = game.config.cols + 1
        const offset = isHorizontal ? dotsColumnCount : 1

        // top or left square
        if (
          `${firstDotPosition - offset}_${firstDotPosition}` in game.dashes
          && `${firstDotPosition - offset}_${secondDotPosition - offset}` in game.dashes
          && `${secondDotPosition - offset}_${secondDotPosition}` in game.dashes
        ) {
          const squarePosition =
            firstDotPosition
            - ((firstDotPosition / dotsColumnCount) | 0)
            - (isHorizontal ? game.config.cols : 1)

          toUpdate.boxes[squarePosition] = game.activePlayerIndex

          // I'll move again
          toUpdate.activePlayerIndex = game.activePlayerIndex
        }

        // bottom or right square
        if (
          `${firstDotPosition}_${firstDotPosition + offset}` in game.dashes
          && `${firstDotPosition + offset}_${secondDotPosition + offset}` in game.dashes
          && `${secondDotPosition}_${secondDotPosition + offset}` in game.dashes
        ) {
          const squarePosition = firstDotPosition - ((firstDotPosition / dotsColumnCount) | 0)
          toUpdate.boxes[squarePosition] = game.activePlayerIndex

          // I'll move again
          toUpdate.activePlayerIndex = game.activePlayerIndex
        }

        return toUpdate
      })

      return {
        success: true,
      }
    }),

  changeDisplayName: publicProcedure
    .input(
      z.object({
        gameId: z.string(),
        playerId: z.string(),
        playerName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const p = await dotsAndBoxesRef.child(input.gameId).child('players').get()
      console.log({ p })
      // await dotsAndBoxesRef.child(input.gameId).child('players').transaction((game: Game) => {})
      return { success: true }
    }),
})
