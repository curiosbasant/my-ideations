import { notFound } from 'next/navigation'

import { getSupabase } from '~/lib/supabase'
import { api } from '~/lib/trpc'
import { Arena, PlayerList, StoreProvider } from './client'

export default async function DotsAndBoxesPage(props: { params: { gameId: string } }) {
  const { gameId } = props.params
  const supabase = getSupabase()
  const board = await api.dotsAndBoxes.get({ boardId: gameId })
  if (!board) notFound()

  const { data } = await supabase.auth.getSession()
  const players = await Promise.all(
    board.players.map((pId: string) => api.user.get({ userId: pId })),
  )

  return (
    <div className='flex w-full flex-col gap-8 lg:flex-row'>
      <StoreProvider
        initialState={{
          players,
          activePlayerIndex: board.activePlayerIndex,
          boxes: board.boxes ?? {},
          dashes: board.dashes ?? {},
          status: board.status as null,
        }}>
        <Arena
          gameId={gameId}
          rows={board.rows}
          cols={board.cols}
          onToggleDash={async (dashName: string) => {
            'use server'
            await api.dotsAndBoxes.move({ boardId: gameId, dashName })
          }}
        />
        <PlayerList gameId={gameId} userId={data.session?.user?.id} />
      </StoreProvider>
    </div>
  )
}
