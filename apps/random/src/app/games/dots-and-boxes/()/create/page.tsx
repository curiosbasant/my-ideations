import Link from 'next/link'

import { createAction } from '../../actions'
import { ActionButton } from '../../client'

export default function DotsAndBoxesCreatePage() {
  return (
    <form className='space-y-4' action={createAction}>
      <fieldset className='flex gap-4'>
        <label className='block space-y-1'>
          <span className='text-sm'>Rows</span>
          <input
            className='w-full rounded-md border-slate-300 bg-slate-100 shadow-inner'
            defaultValue={7}
            name='rows'
            type='number'
          />
        </label>
        <label className='block space-y-1'>
          <span className='text-sm'>Cols</span>
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
      <ActionButton>Create Game</ActionButton>
      <Link
        href='/games/dots-and-boxes'
        className='block w-full rounded-md px-4 py-2 text-center text-sky-500 outline outline-1 -outline-offset-1 outline-current'>
        Cancel
      </Link>
    </form>
  )
}
