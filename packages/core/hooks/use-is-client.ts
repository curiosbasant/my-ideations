import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => void 0

export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}
