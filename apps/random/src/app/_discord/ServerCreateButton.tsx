'use client'

import { useMutation } from '~/hooks'
import apiRequest from '~/lib/apiRequest'
import ServerListButton from './ServerListButton'

const createServer = () => apiRequest.post('/discord/api/servers')

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
