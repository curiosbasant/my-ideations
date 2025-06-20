'use client'

import { useSyncExternalStore, type ReactNode } from 'react'

const emptySubscribe = () => () => void 0

export function ClientOnly(props: { children: () => ReactNode }) {
  const isServer = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true,
  )

  return isServer ? null : props.children()
}
