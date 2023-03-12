'use client'

import { useMutation } from '~/hooks'
import ServerListButton from './ServerListButton'

const createServer = () => fetch('/discord/api/servers/create', { method: 'POST' })

export default function ServerCreateButton() {
  const mutation = useMutation(createServer)

  return (
    <ServerListButton
      onClick={() => {
        mutation.mutate(undefined)
      }}
    />
  )
}
