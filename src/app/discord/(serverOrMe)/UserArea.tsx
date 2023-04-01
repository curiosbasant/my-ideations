'use client'

import { useState } from 'react'

import UserAvatar from './UserAvatar'

export default function UserArea() {
  return (
    <footer className='bg-slate-900/40'>
      <div className='space-y-2 border-b border-slate-500/25 p-2'>
        <div className='flex items-center'>
          <div className='w-0 flex-1'>
            <span className='flex items-center gap-1 text-sm font-bold leading-none text-emerald-500'>
              <span className='align-text-bottom font-icon text-lg'>signal_cellular_alt</span> Voice
              Connected
            </span>
            <p className='truncate text-xs'>General / Ownly One a biig big name here goes </p>
          </div>
          <button
            className='ml-2 h-8 w-8 rounded bg-slate-50 bg-opacity-0 p-1 pt-0.5 hover:bg-opacity-10'
            type='button'>
            <span className='font-icon text-slate-400'>call</span>
          </button>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <button
            className='flex items-center justify-center gap-2 rounded bg-slate-50/5 py-1.5 text-sm text-slate-500'
            type='button'>
            <span className='font-icon text-xl'>videocam</span> Video
          </button>
          <button
            className='flex items-center justify-center gap-2 rounded bg-slate-50/5 py-1.5 text-sm text-slate-500'
            type='button'>
            <span className='font-icon text-xl'>screen_share</span> Screen
          </button>
        </div>
      </div>
      <div className='flex items-center gap-1 p-1.5 pr-2'>
        <button
          className='flex w-0 flex-1 items-center gap-2 rounded-md bg-slate-50 bg-opacity-0 py-1 px-0.5 hover:bg-opacity-10'
          type='button'>
          <UserAvatar ringColor='slate-800/60' />
          <div className='flex w-0 flex-1 flex-col'>
            <div className=''>
              <p className='truncate text-sm font-bold text-slate-300'>CuriosBasant</p>
            </div>
            <div className=''>
              <p className='truncate text-xs leading-none text-slate-500'>
                Just a few lines more...
              </p>
            </div>
          </div>
        </button>

        <div className='flex'>
          <StrikeButton icon='mic' />
          <StrikeButton icon='headset' />
          <button
            className='h-8 w-8 rounded bg-slate-50 bg-opacity-0 p-1 pt-0.5 hover:bg-opacity-10'
            type='button'>
            <span className='font-icon text-xl text-slate-400'>settings</span>
          </button>
        </div>
      </div>
    </footer>
  )

  function StrikeButton({ icon }: { icon: string }) {
    const [open, setOpen] = useState(true)

    return (
      <button
        className='relative h-8 w-8 rounded bg-slate-50 bg-opacity-0 p-1 hover:bg-opacity-10'
        onClick={() => setOpen(!open)}
        type='button'>
        <span
          className={`absolute top-1.5 right-1.5 block w-0.5 ${
            open ? 'h-0' : 'h-7'
          } origin-top rotate-45 rounded-full bg-rose-500 transition-all duration-75`}
        />
        <span className='font-icon text-xl text-slate-400'>{icon}</span>
      </button>
    )
  }
}
