import { useEffect } from 'react'
import { setStatusBarStyle } from 'expo-status-bar'
import { colorScheme } from 'nativewind'

import { useStorage } from '~/lib/storage'

export type ThemeValue = 'light' | 'dark' | 'system'

export function useTheme() {
  const [preference, setPreference] = useStorage<ThemeValue>('theme-preference', 'system')

  useEffect(() => {
    colorScheme.set(preference)
    //  Keeping status bar light, as header is always dark
    setStatusBarStyle('light')
  }, [preference])

  return [preference, setPreference] as const
}
