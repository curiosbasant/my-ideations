import Link from 'next/link'

import { LayoutProps } from '~/types/utilities.type'
import ChannelListSidebar from '../ChannelListSidebar'
import UserAvatar from '../UserAvatar'

export default function MeLayout(props: LayoutProps) {
  return (
    <>
      <ChannelListSidebar>
        <header className='shrink-0 basis-12 border-b border-slate-900/50 p-2 shadow'>
          <button
            className='h-full w-full rounded-md bg-slate-900/50 px-2 text-left text-sm text-slate-500'
            type='button'>
            Find or start a conversation
          </button>
        </header>
        <nav className='relative h-0 flex-1 overflow-y-auto p-2'>
          <ul className='space-y-1'>
            <ChannelButtonListItem icon='person' label='Friends' active />
            <ChannelButtonListItem icon='bolt' label='Nitro' />
            <div className='flex items-center justify-between px-2 pt-3 text-slate-400 hover:text-slate-300'>
              <span className='text-xs uppercase'>Direct Messages</span>
              <button className=''>
                <span className='font-icon text-xl'>add</span>
              </button>
            </div>
            {[{ id: 2, name: 'name big one' }].map((ch) => (
              <li className='' key={ch.id}>
                <Link
                  className='group flex w-full items-center gap-4 rounded-md bg-slate-50 bg-opacity-0 py-1 px-2 text-slate-400 transition hover:bg-opacity-5 focus:bg-opacity-10'
                  href={`/discord/me/${ch.id}`}
                  shallow>
                  <UserAvatar presence='dnd' ringColor='slate-700' />
                  <span className=''>{ch.name}</span>
                  <span className='ml-auto font-icon text-xl opacity-0 group-hover:opacity-100'>
                    close
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ChannelListSidebar>
      <div className='group/channel-view flex flex-1 flex-col bg-slate-700'>{props.children}</div>
    </>
  )
}

function ChannelButtonListItem(props: { icon: string; label: string; active?: boolean }) {
  return (
    <li className=''>
      <button
        className={`flex w-full items-center gap-3 rounded-md bg-slate-50 bg-opacity-0 py-2 px-4 ${
          props.active ? 'bg-opacity-10 text-slate-300' : 'bg-opacity-0 hover:bg-opacity-5'
        }`}>
        <span className='font-icon'>{props.icon}</span> {props.label}
      </button>
    </li>
  )
}
