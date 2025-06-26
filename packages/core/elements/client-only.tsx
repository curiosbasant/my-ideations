'use client'

import { useSyncExternalStore, type ReactNode } from 'react'

const emptySubscribe = () => () => void 0

export function ClientOnly(props: { fallback?: ReactNode; children: () => ReactNode }) {
  const isServer = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true,
  )
  return isServer ? props.fallback : props.children()
}
