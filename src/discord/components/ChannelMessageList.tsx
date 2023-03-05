import { useLayoutEffect, useRef } from 'react'
import { useDiscord } from '../providers/DiscordProvider'
import { ChannelType, MessageType } from '../types'
import ChannelMessageListItem from './ChannelMessageListItem'
import ChannelMessageSender from './ChannelMessageSender'
import GuildMemberList from './GuildMemberList'
import PanelTop from './PanelTop'
import TypingAnimation from './TypingAnimation'

type ChannelMessageListProps = {
  channel: ChannelType
  messages: MessageType[]
}
export default function ChannelMessageList({ channel, messages }: ChannelMessageListProps) {
  const { state, dispatch } = useDiscord()
  const scrollableDiv = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const div = scrollableDiv.current!.lastElementChild!.lastElementChild!
    div.scrollIntoView()
    // div.scrollTo({ top: div.scrollHeight })
  }, [])
  return (
    <div className='flex grow flex-col bg-slate-600'>
      <ChannelHeader channelName={channel.name} />
      <div className='flex grow'>
        <main className=' flex grow flex-col'>
          <div ref={scrollableDiv} className='relative flex h-0   grow  flex-col  overflow-y-auto '>
            <UnreadMessagesTopNotifier />
            <div className='mt-auto'>channles</div>
            <ul className=''>
              {messages.map((n, i) => (
                <ChannelMessageListItem key={i} />
              ))}
              <DayDivider date={1637483433264} isNew />
              <ChannelMessageListItem />
              <DayDivider isNew />

              <ChannelMessageListItem />
              <ChannelMessageListItem />
            </ul>
          </div>
          <div className='px-4'>
            <ChannelMessageSender />
            <div className='flex items-center justify-between'>
              <div className='space-x-1'>
                <TypingAnimation />
                <span className='text-sm text-slate-300'>Harsha and Arnab are typing...</span>
              </div>
              <div className='text-slate-300'>
                <span className='text-sm '>Slowmode is enabled</span>
                <span className='font-icon text-xl '>timer</span>
              </div>
            </div>
          </div>
        </main>
        {state.showMembers && <GuildMemberList />}
      </div>
    </div>
  )
}

function ChannelHeader({ channelName }: { channelName: string }) {
  const { state, dispatch } = useDiscord()
  return (
    <PanelTop>
      <div className='shrink-0 pr-4 pl-2'>
        <span className='relative inline-block'>
          <span className='-skew-x-12 font-icon'>tag</span>
          {true && (
            <span className='absolute top-1 right-0 inline-block rounded-sm  bg-slate-600 p-px font-icon text-[0.5rem]'>
              lock
            </span>
          )}
        </span>
        <span className='ml-1 text-slate-300'>{channelName}</span>
      </div>
      <div className='relative  grow border-l border-slate-500/75'>
        <p className='absolute inset-0 truncate  pl-4 text-sm'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure, explicabo! Sint enim
          molestiae ex ut impedit voluptatem iste, id consequuntur eaque labore voluptatibus odio
          neque. Porro ratione nam beatae veniam.
        </p>
        &ensp;
      </div>
      <div className='ml-auto flex gap-4 px-2'>
        <button className='font-icon' type='button'>
          notifications
        </button>
        <button className='font-icon' type='button'>
          push_pin
        </button>
        <button
          className={`font-icon${state.showMembers ? 'text-slate-200' : ''}`}
          onClick={dispatch.toggleShowingMembers}
          type='button'>
          group
        </button>
        <label className='relative block'>
          <input
            className='w-48 rounded-md border-none bg-slate-800/60 py-1 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:w-64'
            placeholder='Search'
            type='text'
          />
          <span className='absolute right-2 top-0 align-middle font-icon text-xl'>search</span>
        </label>
        <button className='font-icon'>inbox</button>
        <button className='font-icon'>help</button>
      </div>
    </PanelTop>
  )
}

type DayDividerProps = { date: number; isNew?: boolean } | { date?: number; isNew: boolean }
function DayDivider({ date, isNew }: DayDividerProps) {
  return (
    <div className={`my-2 flex items-center gap-2 px-4 ${isNew ? 'text-rose-500' : ''}`}>
      {date && (
        <>
          <div className='h-px grow bg-current' />
          <span className='text-xs text-current'>
            {new Date(date).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </>
      )}
      <div className='relative h-px grow bg-current'>
        {isNew && (
          <div className='absolute right-0 -top-px -translate-y-1/2'>
            <span className='inline-block h-4 border-8 border-l-0 border-transparent border-r-current align-middle' />
            <span className='inline-block rounded-r bg-rose-500 pl-0.5 pr-1  align-middle  text-xs font-semibold  text-slate-200'>
              NEW
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function NewMessageIndicator() {
  return (
    <div className='mb-2 flex items-center  px-4'>
      <div className='h-px grow bg-rose-500' />
      <div className='h-4 border-8 border-l-0 border-transparent border-r-rose-500' />
      <span className='inline-block rounded-r bg-rose-500 pl-0.5  pr-1 align-bottom text-xs font-semibold  text-slate-200'>
        NEW
      </span>
    </div>
  )
}

function UnreadMessagesTopNotifier() {
  return (
    <div className='sticky -top-px z-10 px-4'>
      <div className='flex items-center justify-between rounded-b-lg bg-blue-500 px-3 pt-px text-sm text-slate-50 shadow-md'>
        <div className=''>2 new messages since 2:43pm</div>
        <div className=''>
          Mark as Read <span className='font-icon text-xl'>mark_chat_read</span>
        </div>
      </div>
    </div>
  )
}
