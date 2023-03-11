import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Layout } from '~/discord/components'
import DiscordProvider from '~/discord/providers/DiscordProvider'

const DiscordPage: NextPage = () => {
  const router = useRouter()
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    if (!router.query.ids) return
    if (!router.query.ids[0]) {
      router.push('/discord/@me')
      return
    }
    setIds(router.query.ids as string[])
  }, [router.query.ids])

  return ids[0] ? (
    <DiscordProvider>
      <Layout
        userId='123'
        serverId={ids[0]}
        channelId={ids[1]}
        enableControls={'controls' in router.query}
      />
    </DiscordProvider>
  ) : null
}

export default DiscordPage
