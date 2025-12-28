import type { ReactNode } from 'react'

import { useIsClient } from '../hooks/use-is-client'

export function ClientOnly(props: { fallback?: ReactNode; children: () => ReactNode }) {
  const isClient = useIsClient()
  return isClient ? props.children() : props.fallback
}
