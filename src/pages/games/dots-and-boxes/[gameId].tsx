import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signInAnonymously } from 'firebase/auth'
import { onValue, ref, set } from 'firebase/database'

import GamesLayout from '~/app/games/layout'
import { User } from '~/providers'
import { api } from '~/utils/api'
import { auth, database } from '~/utils/firebase.client'

type GameType = {
  id: string
  config: { rows: number; cols: number }
  players: {
    id: string
    displayName: string
    isActive: boolean
    boxCount: number
  }[]
  activePlayerIndex: 0
  lastDash?: string | null
  // Map of dash name to player index
  dashes: Record<string, number>
  boxes: Record<string, number>
  status: 'waiting' | 'running'
}

const DASH_COLORS = ['text-sky-500', 'text-orange-500', 'text-emerald-500', 'text-violet-500']

export default function DotsAndBoxesPage() {
  const router = useRouter()

  const user = User.use()
  const [game, setGame] = useState<GameType | null>(null)

  useEffect(() => {
    if (router.query.gameId) {
      const { stream } = streamPlay(router.query.gameId as string)
      return stream(setGame)
    }
  }, [router.query.gameId])

  if (!game) return null

  return (
    <GamesLayout>
      <div className='flex w-full flex-col gap-8 lg:flex-row'>
        <Arena
          active={game.status === 'running' && game.players[game.activePlayerIndex].id === user?.id}
          gameId={game.id}
          userId={user?.id}
          {...game.config}
          boxes={game.boxes}
          dashes={game.dashes}
          activeDash={game.lastDash}
        />
        <Players
          gameId={game.id}
          userId={user?.id}
          players={game.players}
          isWaiting={game.status === 'waiting'}
        />
      </div>
    </GamesLayout>
  )
}

function Arena(props: {
  active?: boolean
  gameId: string
  userId?: string | null
  rows: number
  cols: number
  boxes: Record<string, number>
  dashes: Record<string, number>
  activeDash?: string | null
}) {
  const makeMoveMutation = api.dotsAndBoxes.makeMove.useMutation()

  const toggleDash = (name: string) => () => {
    props.userId &&
      makeMoveMutation.mutate({
        dashName: name,
        gameId: props.gameId,
        playerId: props.userId,
      })
  }
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
            const playerIndex = props.boxes[boxIndex]
            return typeof playerIndex === 'number' ? (
              <div className={`bg-current ${DASH_COLORS[playerIndex]} text-opacity-75`} key={i} />
            ) : (
              <Fragment key={i}>&ensp;</Fragment>
            )
          }

          const hA = (cellRowIndex * (props.cols + 1) + cellColIndex - 1) / 2
          const vA = ((cellRowIndex - 1) * (props.cols + 1) + cellColIndex) / 2
          const dashName = isRowEven ? `${hA}_${hA + 1}` : `${vA}_${vA + props.cols + 1}`
          const dashPlayerIndex = props.dashes[dashName]

          return (
            <button
              className={`relative ${
                // if occupied
                typeof dashPlayerIndex === 'number'
                  ? `bg-current ${DASH_COLORS[dashPlayerIndex]}`
                  : 'bg-slate-300 bg-opacity-40 hover:bg-opacity-100'
              } transition ${
                // if horizontal
                isRowEven
                  ? 'before:right-full after:left-full befter:top-0'
                  : 'before:bottom-full after:top-full befter:left-0'
              } befter:absolute befter:z-10 befter:rounded-full befter:p-1 ${
                dashName === props.activeDash ? 'befter:ring-2' : 'enabled:hover:befter:ring-2'
              } befter:ring-offset-[5px]`}
              onClick={toggleDash(dashName)}
              disabled={!props.active || typeof dashPlayerIndex === 'number'}
              type='button'
              key={i}
            />
          )
        })}
      </div>
    </section>
  )
}

function Players(props: {
  gameId: string
  userId?: string | null
  players: GameType['players']
  isWaiting?: boolean
}) {
  const startMutation = api.dotsAndBoxes.start.useMutation()
  const joinMutation = api.dotsAndBoxes.join.useMutation()

  const isOP = props.players.length > 0 && props.players[0].id === props.userId
  const errorText = startMutation.error?.message || joinMutation.error?.message

  return (
    <section className='shrink-0 basis-full space-y-4 lg:max-w-sm'>
      <h2 className='text-2xl font-bold'>Players</h2>
      <ul className=''>
        {props.players.map((player, i) => (
          <PlayerListItem
            isActive={player.isActive}
            name={`${i + 1}. ${player.id === props.userId ? 'You' : player.displayName} ${
              player.boxCount ? `(${player.boxCount})` : ''
            }`}
            color={DASH_COLORS[i]}
            canBeKicked={i > 0 && isOP}
            key={player.id}
          />
        ))}
      </ul>
      {props.isWaiting && (
        <div className='flex flex-col items-center'>
          <p className=''>
            <span className='inline-block animate-spin rounded-full border-2 border-y-slate-500 border-x-transparent p-1.5 align-middle' />
            &ensp;Waiting for players to join...
          </p>
          {isOP ? (
            <button
              className='mt-4 rounded-md bg-emerald-500 px-4 py-2 text-slate-50 transition-colors hover:bg-emerald-400 disabled:bg-slate-400'
              onClick={() =>
                props.userId
                  ? startMutation.mutate({
                      gameId: props.gameId,
                      playerId: props.userId,
                    })
                  : undefined
              }
              disabled={props.players.length < 2}>
              Start Game
            </button>
          ) : (
            props.players.length < 4 && (
              // Remove if already joined
              <button
                className='mt-4 rounded-md bg-emerald-500 px-4 py-2 text-slate-50 transition-colors hover:bg-emerald-400 disabled:bg-slate-500 '
                onClick={async () => {
                  const { user } = await signInAnonymously(auth)
                  joinMutation.mutate({
                    gameId: props.gameId,
                    playerId: user.uid,
                  })
                }}
                disabled={props.userId ? props.players.some((p) => p.id === props.userId) : false}>
                {props.userId && props.players.some((p) => p.id === props.userId)
                  ? 'Game Joined'
                  : 'Join Game'}
              </button>
            )
          )}
          {errorText && <p className='text-sm text-rose-500'>{errorText}</p>}
        </div>
      )}
    </section>
  )
}

function PlayerListItem(props: {
  isActive?: boolean
  color?: string
  name: string
  canBeKicked?: boolean
}) {
  function handleKickingPlayer() {
    // Axios.patch("/api/dots-and-boxes?action=kick-player", { playerId: player.id })
  }

  return (
    <li
      className={`group ${props.isActive ? 'bg-current font-semibold' : ''} ${
        props.color
      } rounded-md px-4 py-2 transition-colors delay-150`}>
      <div className={`flex justify-between ${props.isActive ? 'text-slate-50' : ''}`}>
        <h3 className='w-0 flex-1 truncate tabular-nums'>{props.name}</h3>
        {props.canBeKicked && (
          <button
            className='font-icon text-xl opacity-0 transition-opacity group-hover:opacity-100'
            onClick={handleKickingPlayer}>
            close
          </button>
        )}
        {/* {me && <EditNameDialog currentName={player.display} />} */}
      </div>
    </li>
  )
}

function streamPlay(gameId: string) {
  const gameRef = ref(database, `apps/games/dotsAndBoxes/${gameId}`)
  const stream = (callback: (data: any) => void) =>
    onValue(
      gameRef,
      (snapshot) => {
        const data = snapshot.val() as GameType
        if (!data) return callback(null)

        const playerBoxMap = data.boxes
          ? Object.values(data.boxes).reduce((playerMap, playerIndex) => {
              playerMap[playerIndex] ??= 0
              playerMap[playerIndex]++
              return playerMap
            }, {} as Record<string, number>)
          : {}

        callback({
          ...data,
          dashes: data.dashes || {},
          boxes: data.boxes || {},
          id: gameId,
          players: data.players.map((p, i) => ({
            ...p,
            isActive: i === data.activePlayerIndex,
            boxCount: playerBoxMap[i] ?? 0,
          })),
        })
      },
      console.log
    )

  return { stream }
}
