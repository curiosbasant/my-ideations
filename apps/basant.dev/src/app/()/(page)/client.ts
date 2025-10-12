'use client'

import { useSearchParams } from 'next/navigation'

import { useIsClient } from '@my/core/hooks/use-is-client'

export function TestKru() {
  const isClient = useIsClient()
  useSearchParams()
  return isClient ? location.hash : ''
}
