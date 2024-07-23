import Link from 'next/link'

import { joinAction } from '../actions'
import { ActionButton } from '../client'

export default function DotsAndBoxesPage() {
  return (
    <div className='flex flex-col gap-4'>
      <form className='contents' action={joinAction}>
        <input
          className='rounded-md bg-slate-50 shadow-inner'
          placeholder='Enter game id'
          name='gameId'
          type='text'
        />
        <ActionButton>Join Game</ActionButton>
      </form>
      <div className='flex items-center gap-4 text-sm text-slate-400'>
        <div className='h-px flex-1 bg-slate-200' />
        OR
        <div className='h-px flex-1 bg-slate-200' />
      </div>
      <Link
        href='/games/dots-and-boxes/create'
        className='block w-full rounded-md px-4 py-2 text-center text-sky-500 outline outline-1 -outline-offset-1 outline-current'>
        Create New Game
      </Link>
    </div>
  )
}
