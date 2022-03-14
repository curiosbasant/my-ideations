import { useRouter } from "next/router"
import { useEffect } from "react"

export default function DiscordNotHomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/discord/@me")
  }, [])
  return null
}
