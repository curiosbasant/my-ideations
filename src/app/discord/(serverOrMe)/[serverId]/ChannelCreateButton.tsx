'use client'

import { useMutation } from '~/hooks'

const createChannel = (payload: { serverId: string }) =>
  fetch('/discord/api/channels/create', { method: 'POST', body: JSON.stringify(payload) })

export default function ChannelCreateButton(props: { serverId: string }) {
  const mutation = useMutation(createChannel)

  return (
    <button
      className='rounded-full bg-slate-50/10 p-3 font-icon text-3xl'
      onClick={() => {
        mutation.mutate(props)
      }}
      type='button'>
      add
    </button>
  )
}
