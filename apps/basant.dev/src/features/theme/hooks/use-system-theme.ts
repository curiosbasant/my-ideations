import { useSyncExternalStore } from 'react'

import type { ThemeResolved } from '../shared'

export function useSystemTheme() {
  return useSyncExternalStore<ThemeResolved>(subscribe, getSnapshot, getServerSnapshot)
}

const mediaQuery = '(prefers-color-scheme: dark)'

function subscribe(callback: () => void) {
  const mql = window.matchMedia(mediaQuery)

  const handler = () => callback()
  mql.addEventListener('change', handler)

  return () => {
    mql.removeEventListener('change', handler)
  }
}

function getSnapshot() {
  const isDark = window.matchMedia(mediaQuery).matches
  return isDark ? 'dark' : 'light'
}

function getServerSnapshot(): ThemeResolved {
  return 'light'
}
