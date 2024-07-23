'use server'

import { redirect } from 'next/navigation'

import { api } from '~/lib/trpc'

export async function createAction(formData: FormData) {
  const game = await api.dotsAndBoxes.create({
    fullName: formData.get('playerName') as string,
    rows: Number(formData.get('rows')),
    cols: Number(formData.get('cols')),
  })

  redirect(`/games/dots-and-boxes/${game.id}`)
}

export async function joinAction(formData: FormData) {
  const gameId = formData.get('gameId') as string
  await api.dotsAndBoxes.join({
    fullName: formData.get('playerName') as string,
    boardId: gameId,
  })
  redirect(`/games/dots-and-boxes/${gameId}`)
}

export async function startAction(formData: FormData) {
  const gameId = formData.get('gameId') as string
  await api.dotsAndBoxes.start({ boardId: gameId })
  // reval(`/games/dots-and-boxes`)
}

export async function moveAction(params: { gameId: string; dashName: string }) {
  // const gameId = formData.get('gameId') as string
  // const dashName = formData.get('dashName') as string

  await api.dotsAndBoxes.move({ boardId: params.gameId, dashName: params.dashName })
}
