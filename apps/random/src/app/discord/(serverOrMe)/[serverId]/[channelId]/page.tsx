import { redirect } from 'next/navigation'

import { channelSchema, messageSchema, MessageType, serverSchema } from '~/discord/schemas'
import { APPS, database } from '~/utils/firebase.server'
import UserAvatar from '../../UserAvatar'
import ChannelMemberList from './ChannelMemberList'
import ChannelMessageSender from './ChannelMessageSender'

export default async function ServerChannelViewPage(props: {
  params: { serverId: string; channelId: string }
}) {
  const channelRef = APPS.discord.collection('channels').doc(props.params.channelId)
  const messagesRef = database
    .ref(`discord/messages`)
    .orderByChild('channelId')
    .equalTo(props.params.channelId)

  const [channelSnapshot, channelMessagesSnapshot] = await Promise.all([
    channelRef.get(),
    messagesRef.get(),
  ])

  if (!channelSnapshot.exists) redirect(`/discord/${props.params.serverId}`)

  const channel = channelSchema.parse({ ...channelSnapshot.data(), id: channelSnapshot.id })
  const channelMessagesObj = channelMessagesSnapshot.val()
  const channelMessages: MessageType[] = channelMessagesObj
    ? Object.entries(channelMessagesObj).map(([messageKey, message]) =>
        messageSchema.parse({ ...(message as any), id: messageKey }),
      )
    : []

  return (
    <>
      <header className='flex shrink-0 basis-12 items-center border-b border-slate-800/50 shadow'>
        <div className='flex shrink-0 border-r border-slate-500/75 px-4'>
          <span className='relative inline-block'>
            <span className='-skew-x-8 font-icon'>tag</span>
            {true && (
              <span className='absolute right-0 top-1 inline-block rounded-sm bg-slate-700 p-px font-icon text-[0.5rem]'>
                lock
              </span>
            )}
          </span>
          <span className='ml-1 text-slate-300'>{channel.name}</span>
        </div>
        <div className='w-0 flex-1 pl-4'>
          <p className='truncate text-sm'>{channel.description}</p>
        </div>
        <div className='ml-auto flex gap-4 px-4'>
          <button className='font-icon' type='button'>
            notifications
          </button>
          <button className='rotate-45 font-icon' type='button'>
            push_pin
          </button>
          <label className='select-none' role='button'>
            <input
              id='member-list-toggle-button'
              className='peer absolute appearance-none opacity-0'
              type='checkbox'
            />
            <span className='block font-icon peer-checked:text-slate-200'>group</span>
          </label>

          <label className='relative block' role='button'>
            <input
              className='w-64 rounded-md border-none bg-slate-800/60 p-0.5 pl-1.5 pr-7 text-sm text-slate-100 placeholder:text-slate-200 placeholder-shown:w-36 focus:w-64'
              placeholder='Search'
              type='text'
            />
            <span className='absolute right-1 top-1 align-middle font-icon text-xl tracking-tighter'>
              search
            </span>
          </label>
          <button className='font-icon'>inbox</button>
          <button className='font-icon'>help</button>
        </div>
      </header>
      <div className='flex h-0 flex-1'>
        <main className='flex flex-1 flex-col'>
          <section className='flex flex-1 flex-col overflow-y-auto'>
            <UnreadMessagesTopNotifier />
            <div className='mt-auto space-y-1.5 px-4 py-8'>
              <span className='inline-block select-none rounded-full bg-slate-50/10 p-2'>
                <span className='-skew-x-8 font-icon text-5xl text-slate-300'>tag</span>
              </span>
              <p className='text-4xl font-bold text-white'>Welcome to #{channel.name}!</p>
              <p className=''>This is the start of the #{channel.name} channel.</p>
            </div>
            <ul className='py-2'>
              {channelMessages.map((message, i) => (
                <ChannelMessageListItem {...message} key={i} />
              ))}

              {/* <DayDivider date={1637483433264} />
              <ChannelMessageListItem />
              <DayDivider isNew />

              <ChannelMessageListItem />
              <ChannelMessageListItem /> */}
            </ul>
          </section>
          <ChannelMessageSender channelId={props.params.channelId} channelName={channel.name} />
        </main>

        <ChannelMemberList serverId={props.params.serverId} />
      </div>
    </>
  )
}

function UnreadMessagesTopNotifier() {
  return (
    <div className='sticky -top-px z-10 px-4'>
      <div className='flex items-center justify-between rounded-b-lg bg-blue-500 px-3 py-1 text-xs leading-tight text-slate-50 shadow-md'>
        <div className=''>2 new messages since 2:43pm</div>
        <strong className='flex items-center gap-1'>
          Mark as Read <span className='font-icon text-base'>mark_chat_read</span>
        </strong>
      </div>
    </div>
  )
}

function ChannelMessageListItem(props: { content: string }) {
  return (
    <li className='group isolate mb-2 grid grid-cols-[auto,1fr] gap-y-1 px-4 py-1 hover:bg-slate-500/20'>
      <div className=''>
        <span className='relative left-1/2 top-1/2 -ml-px block h-1/2 w-[calc(100%_-_0.5rem)] rounded-tl border-l-2 border-t-2 border-slate-600' />
      </div>
      <div className='flex items-center gap-1 px-4'>
        <UserAvatar size='xs' ringColor='slate-700' />
        <small className='text-amber-400'>{'<Vansh>'}</small>
        <div className='flex w-0 flex-1 items-center'>
          <p className='inline shrink truncate text-sm'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit iste magnam vel!
            Blanditiis nisi distinctio ipsam, nostrum earum, esse ducimus porro error sunt, velit
            sed saepe laboriosam labore quos repellendus?
          </p>
          &nbsp;
          <small className='text-xxs self-end leading-5'>(edited)</small>
        </div>
      </div>
      <UserAvatar size='lg' ringColor='slate-700' />
      <div className='px-4'>
        <div className=''>
          <span className='text-emerald-400'>Username</span>
          <span className='ml-1 text-xs'>14/03/2022</span>
        </div>
        <p className='break-normal font-sans text-slate-300'>{props.content}</p>
      </div>
    </li>
  )
}

type DayDividerProps = { date: number; isNew?: boolean } | { date?: number; isNew: boolean }
function DayDivider({ date, isNew }: DayDividerProps) {
  return (
    <div className={`my-2 flex items-center px-4 ${isNew ? 'text-rose-500' : 'text-slate-600'}`}>
      {date && (
        <>
          <div className='h-px flex-1 bg-current' />
          <small className='px-2 text-xs text-slate-400 brightness-125'>
            {new Date(date).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </small>
        </>
      )}
      <div className='h-px flex-1 bg-current' />
      {isNew && (
        <>
          <span className='origin-right scale-x-105 border-8 border-l-0 border-transparent border-r-current' />
          <span className='rounded-r bg-current pl-0.5 pr-1'>
            <strong className='block text-xs text-slate-200'>NEW</strong>
          </span>
        </>
      )}
    </div>
  )
}
