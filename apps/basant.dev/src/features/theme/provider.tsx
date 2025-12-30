'use client'

import {
  createContext,
  startTransition,
  useState,
  type Dispatch,
  type PropsWithChildren,
} from 'react'

import { useSystemTheme } from './hooks/use-system-theme'
import { COOKIE_THEME_KEY, type ThemePreference, type ThemeResolved } from './shared'

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

export function ThemeProvider(props: PropsWithChildren<{ defaultTheme: ThemePreference }>) {
  const [themePreference, setTheme] = useState(props.defaultTheme)
  const themeSystem = useSystemTheme()

  const themeResolved = themePreference === 'system' ? themeSystem : themePreference
  const handleSetTheme = (theme: ThemePreference) => {
    startTransition(() => {
      setTheme(theme)
    })
    document.cookie = `${COOKIE_THEME_KEY}=${theme}`
  }

  return (
    <ThemeContext value={{ themeResolved, themeSystem, themePreference, setTheme: handleSetTheme }}>
      {props.children}
    </ThemeContext>
  )
}
