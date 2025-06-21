'use client'

import { immer } from 'zustand/middleware/immer'
import { createStore as createZustandStore } from 'zustand/vanilla'

const defaultInitState = {
  activePlayerIndex: null as number | null,
  players: [] as { id: string; displayName: string; boxCount?: number }[],
  boxes: {} as Record<string, number>,
  dashes: {} as Record<string, number>,
  status: 'waiting' as 'waiting' | 'running' | 'finished' | null,
}
export type State = typeof defaultInitState

type Actions = {
  setBoard: (board: Omit<State, 'players'>) => void
}

export type Store = State & Actions

export const createStore = (initState: Partial<State>) =>
  createZustandStore<Store>()(
    immer((set) => ({
      ...defaultInitState,
      ...initState,

      setBoard(board) {
        const playerBoxMap =
          board.boxes ?
            Object.values(board.boxes).reduce(
              (playerMap, playerIndex) => {
                playerMap[playerIndex] ??= 0
                playerMap[playerIndex]++
                return playerMap
              },
              {} as Record<string, number>,
            )
          : {}
        set((prev) => ({
          ...prev,
          ...board,
          players: prev.players.map((p) => ({ ...p, boxCount: playerBoxMap[p.id] })),
        }))
      },
    })),
  )
