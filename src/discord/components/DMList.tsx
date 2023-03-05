import Link from 'next/link'
import { useState } from 'react'
import { ChannelSidebar, PanelTop, UserProfileIcon } from '.'
import { ChannelType } from '../types'

type GuildChannelListProps = {
  channels: ChannelType[]
  activeChannelId?: string
}
export default function DMList({ channels, activeChannelId = '' }: GuildChannelListProps) {
  return (
    <ChannelSidebar>
      <>
        <PanelTop>
          <button
            className='h-8 w-full rounded-md bg-slate-800/60 px-2 text-left text-sm text-slate-500'
            type='button'>
            Find or start a conversation
          </button>
        </PanelTop>
        {/* Why h-0 works here? */}
        <nav className='h-0 grow overflow-y-auto p-2'>
          <ul className='space-y-1'>
            <ChannelButtonListItem icon='person' label='Friends' active />
            <ChannelButtonListItem icon='bolt' label='Nitro' />
            <div className='flex items-center justify-between px-2 pt-4 text-slate-400 hover:text-slate-300'>
              <span className='text-sm uppercase'>Direct Messages</span>
              <button className=''>
                <span className='font-icon text-xl'>add</span>
              </button>
            </div>
            {channels.map((ch) => (
              <li className='' key={ch.id}>
                <Link
                  href={`@me/${ch.id}`}
                  className='group flex w-full items-center gap-4 rounded-md bg-slate-50 bg-opacity-0 py-1 px-2 text-slate-400 transition hover:bg-opacity-5 focus:bg-opacity-10'
                  shallow>
                  <UserProfileIcon presence='dnd' ringColor='slate-700' />
                  <span className=''>{ch.name}</span>
                  <div className='ml-auto opacity-0 group-hover:opacity-100'>
                    <span className='font-icon text-xl'>close</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </>
    </ChannelSidebar>
  )
}

function ChannelButtonListItem({
  icon,
  label,
  active = false,
}: {
  icon: string
  label: string
  active?: boolean
}) {
  return (
    <li className=''>
      <button
        className={`flex w-full items-center gap-4 rounded-md bg-slate-50 bg-opacity-0 py-1 px-4 ${
          active ? 'bg-opacity-10 text-slate-300' : ' bg-opacity-0 hover:bg-opacity-5 '
        }`}>
        <span className='font-icon text-3xl'>{icon}</span>
        <span className=''>{label}</span>
      </button>
    </li>
  )
}
