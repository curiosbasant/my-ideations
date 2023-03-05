import { useToggle } from '@curiosbasant/react-compooks'
import { signInAnonymously } from 'firebase/auth'
import { useRouter } from 'next/router'

import GamesLayout from '~/app/games/layout'
import { api } from '~/utils/api'
import { auth } from '~/utils/firebase.client'

export default function DotsAndBoxesPage() {
  const router = useRouter()
  const createGameMutation = api.dotsAndBoxes.createNew.useMutation()
  const [isCreatingNewGame, toggleCreatingNewGame] = useToggle()
  const [isLoading, toggleLoading] = useToggle()

  return (
    <GamesLayout>
      <form
        className='m-auto w-full max-w-sm space-y-4 rounded-lg bg-white p-8 shadow-md shadow-sky-200'
        onSubmit={async (ev) => {
          ev.preventDefault()
          const fd = new FormData(ev.currentTarget)
          const data = Object.fromEntries(fd.entries())
          let gameId = data.gameId as string

          if (isCreatingNewGame) {
            toggleLoading()
            try {
              const { user } = await signInAnonymously(auth)

              gameId = await createGameMutation.mutateAsync({
                playerId: user.uid,
                playerName: data.playerName as string,
                rows: +data.rows,
                cols: +data.cols,
              })
            } catch (error) {
              toggleLoading()
              return
            }
          }

          router.push(`/games/dots-and-boxes/${gameId}`)
        }}>
        {isCreatingNewGame ? (
          <>
            <fieldset className='flex gap-4'>
              <label className='block'>
                <span className=''>Rows</span>
                <input
                  className='w-full rounded-md border-slate-300 bg-slate-100 shadow-inner'
                  defaultValue={7}
                  name='rows'
                  type='number'
                />
              </label>
              <label className='block'>
                <span className=''>Cols</span>
                <input
                  className='w-full rounded-md border-slate-300 bg-slate-100 shadow-inner'
                  defaultValue={10}
                  name='cols'
                  type='number'
                />
              </label>
            </fieldset>
            <input
              className='rounded-md bg-slate-50 shadow-inner'
              placeholder='Enter your name'
              name='playerName'
              type='text'
            />
            <button
              className='w-full rounded-md bg-sky-500 px-4 py-2 text-white disabled:bg-slate-500'
              disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Game'}
            </button>
            <button
              className='w-full rounded-md px-4 py-2 text-sky-500 outline -outline-offset-1 outline-current'
              onClick={() => toggleCreatingNewGame()}
              type='button'>
              Cancel
            </button>
          </>
        ) : (
          <>
            <input
              className='rounded-md bg-slate-50 shadow-inner'
              placeholder='Enter game id'
              name='gameId'
              type='text'
            />
            <button className='w-full rounded-md bg-sky-500 px-4 py-2 text-white'>Join Game</button>
            <div className='flex items-center gap-4 text-sm text-slate-400'>
              <div className='h-px flex-1 bg-slate-200' />
              OR
              <div className='h-px flex-1 bg-slate-200' />
            </div>
            <button
              className='w-full rounded-md px-4 py-2 text-sky-500 outline -outline-offset-1 outline-current'
              onClick={() => toggleCreatingNewGame()}
              type='button'>
              Create New Game
            </button>
          </>
        )}
      </form>
    </GamesLayout>
  )
}
