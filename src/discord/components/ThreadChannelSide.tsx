import { useDiscord } from '../providers/DiscordProvider'
import ChannelMessageSender from './ChannelMessageSender'
import PanelTop from './PanelTop'
import TypingAnimation from './TypingAnimation'

export default function ThreadChannelSide() {
  const { state, dispatch } = useDiscord()
  return (
    <section className='flex shrink-0 basis-1/4 resize-x flex-col rounded-l-xl bg-slate-600'>
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
          <span className='ml-1 text-slate-300'>channelName</span>
        </div>
        <div className='ml-auto flex gap-4 px-2'>
          <button className='font-icon' type='button'>
            notifications
          </button>
          <button className='font-icon' type='button'>
            more_horiz
          </button>

          <button className='font-icon' onClick={dispatch.toggleShowingChannelThread} type='button'>
            close
          </button>
        </div>
      </PanelTop>
      <div className='grow'></div>
      <div className='px-4'>
        <ChannelMessageSender />
        <div className='flex items-center justify-between'>
          <div className='space-x-1'>
            <TypingAnimation />
            <span className='text-sm text-slate-300'>Harsha and Arnab are typing...</span>
          </div>
        </div>
      </div>
    </section>
  )
}
