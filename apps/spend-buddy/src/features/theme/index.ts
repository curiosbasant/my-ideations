import { useEffect } from 'react'
import { colorScheme } from 'nativewind'

import { useStorage } from '~/lib/storage'

export type ThemeValue = 'light' | 'dark' | 'system'

export function useTheme() {
  const [preference, setPreference] = useStorage<ThemeValue>('theme-preference', 'system')

  useEffect(() => {
    colorScheme.set(preference)
  }, [preference])

  return [preference, setPreference] as const
}
