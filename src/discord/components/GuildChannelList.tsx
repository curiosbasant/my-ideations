import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { splitArray } from '~/utils/general.util'
import { ChannelSidebar, PanelTop, UserProfileIcon } from '.'
import { ChannelType, ServerType } from '../types'

type GuildChannelListProps = {
  server: ServerType
  channels: ChannelType[]
  activeChannelId: string
  createNewChannel?: (name: string) => void
  // createNewChannel?:(data:Partial<ChannelType>)=>void
}
export default function GuildChannelList({
  server,
  channels,
  activeChannelId,
  createNewChannel,
}: GuildChannelListProps) {
  const categorizedChannels: Record<string, ChannelType[]> = { UNCATEGORIZED: [] }
  const [categoryChannels, nonCategoryChannels] = splitArray(
    channels,
    (ch) => ch.type == 'category'
  )
  for (const channel of nonCategoryChannels) {
    const catId = channel.parentId ?? 'UNCATEGORIZED'

    categorizedChannels[catId] ??= []
    categorizedChannels[catId].push(channel)
  }

  const UNCATEGORIZED = categorizedChannels.UNCATEGORIZED
  delete categorizedChannels.UNCATEGORIZED

  return (
    <ChannelSidebar>
      <>
        <PanelTop>
          <div className='-mx-2 grow self-stretch '>
            <button
              className='flex h-full w-full items-center justify-between  px-4 text-xl font-semibold text-slate-300'
              type='button'>
              <h1 className=''>{server.name}</h1>
              <span className='font-icon'>expand_more</span>
            </button>
          </div>
        </PanelTop>
        {/* Why h-0 works here? */}
        <nav className='relative h-0 grow overflow-y-auto p-2'>
          <button className='absolute inset-2 bottom-auto rounded-full bg-slate-500/90 py-1 text-sm font-semibold uppercase text-slate-300 shadow-md'>
            New Unreads
          </button>
          <ul className=''>
            <div className='flex justify-center py-4 hover:text-slate-300'>
              <button
                className='rounded-full bg-slate-600 px-4 py-3'
                onClick={(ev) => createNewChannel?.('awesome channel')}>
                <span className='font-icon text-3xl'>add</span>
              </button>
            </div>
            {UNCATEGORIZED.map((ch) => (
              <ChannelListItem data={ch} active={ch.id == activeChannelId} key={ch.id} />
            ))}
            {categoryChannels.map((ch) => (
              <CategoryChannelListItem
                data={ch}
                channels={categorizedChannels[ch.id]}
                activeChannelId={activeChannelId}
                key={ch.id}
              />
            ))}
          </ul>
        </nav>
      </>
    </ChannelSidebar>
  )
}
type ChannelListItemProps = {
  data: ChannelType
  active?: boolean
}
function ChannelListItem({ data, active }: ChannelListItemProps) {
  const router = useRouter()
  const query = { ...router.query }
  delete query.ids
  return (
    <li>
      <Link
        href={{
          pathname: `/discord/${data.serverId}/${data.id}`,
          query,
        }}
        className={`group mt-1 flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 ${
          active ? 'bg-opacity-10' : 'bg-opacity-0 hover:bg-opacity-5'
        } before:absolute before:left-0 before:h-2 before:w-1 before:rounded-r-full before:bg-slate-300`}
        shallow>
        <div className='relative'>
          {data.type == 'text' ? (
            <span className='-skew-x-12 font-icon'>tag</span>
          ) : (
            <span className='font-icon'>volume_up</span>
          )}
          {data.locked && (
            <span className='absolute top-1 right-0 inline-block rounded-sm  bg-slate-700 p-px font-icon text-[0.5rem]'>
              lock
            </span>
          )}
        </div>
        <h4 className='grow  text-slate-300'>{data.name}</h4>
        <CreateInviteButton show={active} />
        {data.type == 'voice' && (
          <div className='relative overflow-hidden rounded-full bg-slate-600 py-px px-1.5 text-sm shadow group-hover:hidden'>
            <span className='absolute -inset-1 left-1/2 -skew-x-12 bg-slate-800/80' />
            <span className='relative mr-2 px-0.5'>03</span>
            <span className='relative px-0.5'>12</span>
          </div>
        )}
      </Link>
    </li>
  )
}

type CategoryChannelListItem = {
  data: ChannelType
  channels: ChannelType[]
  activeChannelId?: string
}
function CategoryChannelListItem({ data, channels, activeChannelId }: CategoryChannelListItem) {
  const [expanded, setExpanded] = useState(true)
  return (
    <>
      <li className='-ml-2 mt-4  hover:text-slate-300'>
        <div className='flex items-center'>
          <button className='contents' onClick={() => setExpanded(!expanded)} type='button'>
            <span className='pl-1 font-icon text-base'>
              {expanded ? 'expand_more' : 'chevron_right'}
            </span>
            <h4 className='grow text-left text-sm uppercase tracking-wide'>{data.name}</h4>
          </button>
          <button className='absolute right-4 font-icon' type='button'>
            add
          </button>
        </div>
      </li>
      {expanded &&
        channels.map((ch) => (
          <ChannelListItem data={ch} active={ch.id == activeChannelId} key={ch.id} />
        ))}
    </>
  )
}

function CreateInviteButton({ show = false }) {
  return (
    <div className={`space-x-1 ${show ? '' : 'opacity-0 group-hover:opacity-100'}`}>
      <button className='w-5 font-icon text-base text-slate-300'>person_add_alt_1</button>
      <button className='w-5 font-icon text-base text-slate-300'>settings</button>
    </div>
  )
}
