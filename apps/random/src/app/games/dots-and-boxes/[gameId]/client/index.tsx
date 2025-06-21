'use client'

import { Fragment, useEffect } from 'react'

import { getSupabaseClient } from '~/lib/supabase/client'
import { joinAction, startAction } from '../../actions'
import { useStore } from './provider'

export * from './provider'

const DASH_COLORS = ['text-sky-500', 'text-orange-500', 'text-emerald-500', 'text-violet-500']

export function Arena(props: {
  gameId: string
  active?: boolean
  rows: number
  cols: number
  activeDash?: string | null
  onToggleDash?: (name: string) => void
}) {
  const board = useStore()

  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase.realtime
      .channel(`dots-and-boxes-${props.gameId}`)
      .on<Record<string, any>>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'db__board',
          filter: `id=eq.${props.gameId}`,
        },
        ({ new: b }) => {
          board.setBoard({
            activePlayerIndex: b['active_player_index'],
            boxes: b['boxes'],
            dashes: b['dashes'],
            status: b['status'],
          })
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [props.gameId])

  const gridRowSize = props.rows * 2 + 1
  const gridColSize = props.cols * 2 + 1

  return (
    <section className='relative flex-1 p-2'>
      <div
        className='isolate grid mix-blend-darken'
        style={{
          gridTemplateColumns: `repeat(${props.cols}, 0.5rem 1fr) 0.5rem`,
          gridTemplateRows: `repeat(${props.rows}, 0.5rem 1fr) 0.5rem`,
          aspectRatio: props.cols / props.rows,
        }}>
        {[...Array(gridRowSize * gridColSize)].map((_, i) => {
          const cellRowIndex = (i / gridColSize) | 0
          const cellColIndex = i % gridColSize

          const isRowEven = cellRowIndex % 2 === 0
          const isColEven = cellColIndex % 2 === 0

          // if Dot or Square
          if (isRowEven === isColEven) {
            // if Dot
            if (isRowEven) {
              return <span className='z-20 scale-[2] rounded-full bg-slate-500' key={i} />
            }

            const boxIndex = ((cellRowIndex - 1) * props.cols + cellColIndex - 1) / 2
            const playerIndex = board.boxes[boxIndex]
            return typeof playerIndex === 'number' ?
                <div className={`bg-current ${DASH_COLORS[playerIndex]} text-opacity-75`} key={i} />
              : <Fragment key={i}>&ensp;</Fragment>
          }

          const hA = (cellRowIndex * (props.cols + 1) + cellColIndex - 1) / 2
          const vA = ((cellRowIndex - 1) * (props.cols + 1) + cellColIndex) / 2
          const dashName = isRowEven ? `${hA}_${hA + 1}` : `${vA}_${vA + props.cols + 1}`
          const dashPlayerIndex = board.dashes[dashName]

          return (
            <button
              className={`relative ${
                // if occupied
                typeof dashPlayerIndex === 'number' ?
                  `bg-current ${DASH_COLORS[dashPlayerIndex]}`
                : 'bg-slate-300 bg-opacity-40 hover:bg-opacity-100'
              } transition ${
                // if horizontal
                isRowEven ?
                  'before:right-full after:left-full befter:top-0'
                : 'before:bottom-full after:top-full befter:left-0'
              } befter:absolute befter:z-10 befter:rounded-full befter:p-1 ${
                dashName === props.activeDash ? 'befter:ring-2' : 'enabled:hover:befter:ring-2'
              } befter:ring-offset-[5px]`}
              onClick={() => props.onToggleDash?.(dashName)}
              // disabled={!props.active || typeof dashPlayerIndex === 'number'}
              type='button'
              key={i}
            />
          )
        })}
      </div>
    </section>
  )
}

export function PlayerList(props: { gameId: string; userId?: string | null }) {
  const board = useStore()
  const isOP = board.players.length > 0 && board.players[0].id === props.userId
  // const errorText = startMutation.error?.message || joinMutation.error?.message
  const activePlayerId =
    typeof board.activePlayerIndex === 'number' && board.players[board.activePlayerIndex].id

  return (
    <section className='shrink-0 basis-full space-y-4 lg:max-w-sm'>
      <h2 className='text-2xl font-bold'>Players</h2>
      <ul className=''>
        {board.players.map((player, i) => (
          <PlayerListItem
            active={player.id === activePlayerId}
            name={`${i + 1}. ${player.id === props.userId ? 'You' : player.displayName}${
              player.boxCount ? ` (${player.boxCount})` : ''
            }`}
            color={DASH_COLORS[i]}
            canBeKicked={i > 0 && isOP}
            key={player.id}
          />
        ))}
      </ul>
      {!board.status
        || (board.status === 'waiting' && (
          <div className='flex flex-col items-center'>
            <p className=''>
              <span className='inline-block animate-spin rounded-full border-2 border-x-transparent border-y-slate-500 p-1.5 align-middle' />
              &ensp;Waiting for players to join...
            </p>
            {isOP ?
              <form className='contents' action={startAction}>
                <input name='gameId' value={props.gameId} type='hidden' />
                <button
                  className='mt-4 rounded-md bg-emerald-500 px-4 py-2 text-slate-50 transition-colors hover:bg-emerald-400 disabled:bg-slate-400'
                  disabled={board.players.length < 2}>
                  Start Game
                </button>
              </form>
            : board.players.length < 4 && (
                // Remove if already joined
                <form className='' action={joinAction}>
                  <input name='gameId' value={props.gameId} type='hidden' />
                  {props.userId || (
                    <input
                      className='rounded-md bg-slate-50 shadow-inner'
                      placeholder='Enter your name'
                      name='playerName'
                      type='text'
                    />
                  )}
                  {props.userId && board.players.some((p) => p.id === props.userId) ?
                    <button
                      className='mt-4 rounded-md bg-emerald-500 px-4 py-2 text-slate-50 transition-colors hover:bg-emerald-400 disabled:bg-slate-500'
                      disabled>
                      Game Joined
                    </button>
                  : <button className='mt-4 rounded-md bg-emerald-500 px-4 py-2 text-slate-50 transition-colors hover:bg-emerald-400 disabled:bg-slate-500'>
                      Join Game
                    </button>
                  }
                </form>
              )
            }
            {/* {errorText && <p className='text-sm text-rose-500'>{errorText}</p>} */}
          </div>
        ))}
    </section>
  )
}

function PlayerListItem(props: {
  active?: boolean
  color?: string
  name: string
  canBeKicked?: boolean
}) {
  return (
    <li
      className={`group ${props.active ? 'bg-current font-semibold' : ''} ${
        props.color
      } rounded-md px-4 py-2 transition-colors delay-150`}>
      <div className={`flex justify-between ${props.active ? 'text-white' : ''}`}>
        <h3 className='w-0 flex-1 truncate tabular-nums'>{props.name}</h3>
        {props.canBeKicked && (
          <button className='font-icon text-xl opacity-0 transition-opacity group-hover:opacity-100'>
            close
          </button>
        )}
        {/* {me && <EditNameDialog currentName={player.display} />} */}
      </div>
    </li>
  )
}
