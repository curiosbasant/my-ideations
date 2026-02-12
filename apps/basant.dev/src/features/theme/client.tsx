'use client'

import { use } from 'react'
import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { ThemeContext } from './provider'

export function ThemeToggleGroupButton() {
  const { themePreference, setTheme } = use(ThemeContext)
  return (
    <ToggleGroup
      variant='outline'
      type='single'
      size='xs'
      value={themePreference}
      onValueChange={setTheme}>
      <ToggleGroupItem value='system' aria-label='Toggle System Theme'>
        <MonitorIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value='light' aria-label='Toggle Light Theme'>
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value='dark' aria-label='Toggle Dark Theme'>
        <MoonStarIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
