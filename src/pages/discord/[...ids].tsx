import { Layout } from "discord/components"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const DiscordPage: NextPage = () => {
  const router = useRouter()
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    if (!router.query.ids) return
    if (!router.query.ids[0]) {
      router.push("/discord/@me")
      return
    }
    setIds(router.query.ids as string[])
  }, [router.query.ids])

  return ids[0] ? <Layout userId="123" serverId={ids[0]} channelId={ids[1]} /> : null
}

export default DiscordPage
