import Link, { LinkProps } from 'next/link'
import { redirect } from 'next/navigation'

import { ChannelType, channelSchema, serverSchema } from '~/discord/schemas'
import { LayoutProps } from '~/types/utilities.type'
import { APPS } from '~/utils/firebase.server'
import ChannelListSidebar from '../ChannelListSidebar'
import ChannelCreateButton from './ChannelCreateButton'

export default async function ServerLayout(props: LayoutProps<{ serverId: string }>) {
  const serverRef = APPS.discord.collection('servers').doc(props.params.serverId)
  const [serverSnapshot, serverChannelsSnapshot] = await Promise.all([
    serverRef.get(),
    APPS.discord.collection('channels').where('server', '==', serverRef).get(),
  ])

  if (!serverSnapshot.exists) redirect('/discord/me')

  const server = serverSchema.parse({ ...serverSnapshot.data(), id: serverSnapshot.id })
  const serverChannels = serverChannelsSnapshot.docs.map((channel) =>
    channelSchema.parse({ ...channel.data(), id: channel.id })
  )

  return (
    <>
      <ChannelListSidebar>
        <header className='shrink-0 basis-12 border-b border-slate-900/50 shadow'>
          <button
            className='relative flex h-full w-full items-center px-4 text-left font-semibold text-slate-300'
            type='button'>
            <div className='w-0 flex-1'>
              <h1 className='truncate'>{server.name}</h1>
            </div>
            <span className='font-icon'>expand_more</span>
            <span className='inline-blockx absolute top-full hidden -translate-y-1/3 rounded-full bg-slate-600 p-1 pr-1.5 text-xs leading-none'>
              <small className='align-text-bottom font-icon text-sm'>public</small> Public
            </span>
          </button>
        </header>
        <nav className='relative h-0 flex-1 overflow-y-auto p-2'>
          <button className='absolute inset-2 top-auto rounded-full bg-slate-50/10 py-1 text-xs font-semibold uppercase text-slate-300 shadow-md'>
            New Unreads
          </button>
          <div className='flex justify-center py-4 hover:text-slate-300'>
            <ChannelCreateButton serverId={server.id} />
          </div>
          <ul className='space-y-1'>
            {serverChannels.map((ch) => (
              <ChannelListItem {...ch} href={`/discord/${server.id}/${ch.id}`} key={ch.id} />
            ))}
          </ul>
        </nav>
      </ChannelListSidebar>
      <div className='group/channel-view flex flex-1 flex-col bg-slate-700'>{props.children}</div>
    </>
  )
}

function ChannelListItem(
  props: ChannelType & {
    href: LinkProps['href']
    locked?: boolean
  }
) {
  const active = false
  return (
    <li>
      <Link
        className={`group mt-1 flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 ${
          active ? 'bg-opacity-10' : 'bg-opacity-0 hover:bg-opacity-5'
        } before:absolute before:left-0 before:h-2 before:w-1 before:rounded-r-full before:bg-slate-300`}
        href={props.href}>
        <div className='relative'>
          {props.type === 'text' ? (
            <span className='-skew-x-8 font-icon'>tag</span>
          ) : (
            <span className='font-icon'>volume_up</span>
          )}
          {props.locked && (
            <span className='absolute top-1 right-0 inline-block rounded-sm bg-slate-700 p-px font-icon text-[0.5rem]'>
              lock
            </span>
          )}
        </div>
        <h4 className='w-0 flex-1 truncate leading-none text-slate-300'>{props.name}</h4>
        <div className={`gap-1 ${false ? '' : 'hidden group-hover:flex'}`}>
          <button className='w-5 font-icon text-base text-slate-300'>person_add_alt</button>
          <button className='w-5 font-icon text-base text-slate-300'>settings</button>
        </div>
        {props.type === 'voice' && (
          <div className='relative overflow-hidden rounded-full bg-slate-600 py-px px-1.5 text-sm shadow group-hover:hidden'>
            <span className='absolute -inset-1 left-1/2 -skew-x-8 bg-slate-800/80' />
            <span className='relative mr-2 px-0.5'>03</span>
            <span className='relative px-0.5'>12</span>
          </div>
        )}
      </Link>
    </li>
  )
}
