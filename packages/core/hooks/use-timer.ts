import { useEffect, useState } from 'react'

export function useCountdown(from: number) {
  const [countdown, setCountdown] = useState(from)

  useEffect(() => {
    if (countdown < 1) return

    const startTime = Date.now()
    const intervalId = setInterval(() => {
      const delta = ~~((Date.now() - startTime) / 1000)
      setCountdown(from - delta)
    }, 1e3)

    return () => {
      clearInterval(intervalId)
    }
  }, [from, countdown < 1])

  return [countdown, (newFrom = from) => setCountdown(newFrom)] as const
}
