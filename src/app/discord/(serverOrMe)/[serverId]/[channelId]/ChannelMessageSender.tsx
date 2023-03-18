'use client'

import { useMutation } from '~/hooks'
import apiRequest from '~/lib/apiRequest'
import TypingAnimation from './TypingAnimation'

const sendMessage = (payload: { channelId: string; content: string }) =>
  apiRequest.post('/discord/api/messages', payload)

export default function ChannelMessageSender(props: { channelId: string; channelName: string }) {
  const mutation = useMutation(sendMessage)

  return (
    <footer className='px-4'>
      {mutation.isMutating && (
        <div className='flex h-20'>
          <span className='m-auto inline-block animate-spin rounded-full border-4 border-white border-x-transparent p-3' />
        </div>
      )}
      <form
        className='flex items-center rounded-md bg-slate-50/10 shadow-md'
        onSubmit={async (ev) => {
          ev.preventDefault()

          if ('messageContent' in ev.currentTarget.elements) {
            const inputRef = ev.currentTarget.elements.messageContent as HTMLInputElement
            const content = inputRef.value
            inputRef.value = ''

            mutation.mutate({
              channelId: props.channelId,
              content,
            })
          }
        }}>
        <label className='px-4 font-icon text-slate-300'>
          add_circle <input hidden name='' type='file' />
        </label>
        <div className='flex-1 py-0.5'>
          <textarea
            className='block max-h-[50vh] resize-none border-none bg-transparent px-0 py-2 text-slate-300 placeholder:text-slate-400'
            name='messageContent'
            placeholder={`Message #${props.channelName}`}
            rows={1}
            data-message-input-field
            onChange={(ev) => {
              ev.currentTarget.style.height = '0'
              ev.currentTarget.style.height = ev.currentTarget.scrollHeight + 'px'
            }}
          />
        </div>
        <div className='flex shrink-0 divide-x divide-slate-400/75 text-slate-300'>
          <div className='flex gap-4 px-4'>
            <button
              className='rounded bg-slate-300 font-icon text-slate-500 hover:bg-slate-200'
              type='button'>
              gif
            </button>
            <button className='font-icon hover:text-slate-200' type='button'>
              insert_emoticon
            </button>
          </div>
          <div className='px-4'>
            <button
              className='font-icon text-blue-500 hover:text-slate-200 disabled:cursor-not-allowed disabled:text-slate-400 group-[:has([data-message-input-field]:placeholder-shown)]:text-slate-400'
              disabled={mutation.isMutating}>
              send
            </button>
          </div>
        </div>
      </form>
      <div className='flex select-none items-center justify-between py-1'>
        <div className='flex items-center space-x-1.5'>
          <TypingAnimation />
          <span className='text-xs text-slate-300'>Harsha and Arnab are typing...</span>
        </div>
        <div className='flex items-center space-x-1 text-slate-300'>
          <span className='text-xs'>Slowmode is enabled</span>
          <span className='font-icon text-lg'>timer</span>
        </div>
      </div>
    </footer>
  )
}
