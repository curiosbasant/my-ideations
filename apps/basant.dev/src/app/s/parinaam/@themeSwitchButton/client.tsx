'use client'

import { useLayoutEffect, useState } from 'react'
import { MoonStarIcon, SunIcon } from 'lucide-react'

import { COOKIE_THEME_KEY, type ThemePreference } from '~/app/shared'
import { Button } from '~/components/ui/button'

export function ThemeSwitchButton(props: { themePreference?: ThemePreference | null }) {
  const [themePreference, setThemePreference] = useState(props.themePreference ?? 'light')

  useLayoutEffect(() => {
    if (props.themePreference) return

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = isDark ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    setThemePreference(theme)
  }, [props.themePreference])

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => {
        setThemePreference((prev) => {
          const nextTheme = prev === 'dark' ? 'light' : 'dark'
          document.cookie = `${COOKIE_THEME_KEY}=${nextTheme}`
          document.documentElement.dataset.theme = nextTheme
          return nextTheme
        })
      }}
      title={themePreference === 'dark' ? 'Set light theme' : 'Set dark theme'}
      type='button'>
      {themePreference === 'dark' ?
        <SunIcon />
      : <MoonStarIcon />}
    </Button>
  )
}
