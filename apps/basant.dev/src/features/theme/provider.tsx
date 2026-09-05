'use client'

import {
  createContext,
  startTransition,
  useState,
  type Dispatch,
  type PropsWithChildren,
} from 'react'

import { useSystemTheme } from './hooks/use-system-theme'
import {
  COOKIE_THEME_KEY,
  DEFAULT_THEME_VALUE,
  resolveThemePreference,
  type ThemePreference,
  type ThemeResolved,
} from './shared'

export const ThemeContext = createContext<{
  themeResolved: ThemeResolved
  themeSystem: ThemeResolved
  themePreference: ThemePreference
  setTheme: Dispatch<ThemePreference>
}>({
  themeResolved: 'light',
  themeSystem: 'light',
  themePreference: 'light',
  setTheme: () => void 0,
})

export function ThemeProvider(props: PropsWithChildren<{ defaultTheme?: ThemePreference }>) {
  const [themePreference, setThemePreference] = useState(props.defaultTheme ?? DEFAULT_THEME_VALUE)
  const themeSystem = useSystemTheme()

  const themeResolved =
    themePreference === 'dark' || themePreference === 'light' ? themePreference : themeSystem
  const handleSetTheme = (theme: ThemePreference) => {
    startTransition(() => {
      setThemePreference(theme)
    })
    document.cookie = `${COOKIE_THEME_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`
    document.documentElement.dataset['theme'] = resolveThemePreference(theme)
  }

  return (
    <ThemeContext value={{ themeResolved, themeSystem, themePreference, setTheme: handleSetTheme }}>
      {props.children}
    </ThemeContext>
  )
}
