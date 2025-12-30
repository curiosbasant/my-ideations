'use client'

import { use } from 'react'
import { MoonStarIcon, SunIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { ThemeContext } from '~/features/theme/provider'

export function ThemeSwitchButton() {
  const { themeResolved, setTheme } = use(ThemeContext)

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => {
        setTheme(themeResolved === 'dark' ? 'light' : 'dark')
      }}
      title={themeResolved === 'dark' ? 'Set light theme' : 'Set dark theme'}
      type='button'>
      {themeResolved === 'dark' ?
        <SunIcon />
      : <MoonStarIcon />}
    </Button>
  )
}
