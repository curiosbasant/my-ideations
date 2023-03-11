import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function DiscordNotHomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/discord/@me')
  }, [])
  return null
}
