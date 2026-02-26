'use client'

import { Suspense, use, type ComponentProps } from 'react'
import { WifiOffIcon } from 'lucide-react'

import { useIsDeviceOnline, useToggle } from '@my/core/hooks'

import { ThemeContext } from '~/features/theme/provider'

export function HtmlWithDataTheme(props: ComponentProps<'html'>) {
  const { themeResolved } = use(ThemeContext)
  return <html {...props} data-theme={themeResolved} suppressHydrationWarning />
}

export function CurrentYear() {
  return (
    <Suspense>
      <CurrentYearInner />
    </Suspense>
  )
}
function CurrentYearInner() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>
}

export function TimeFormat(props: {
  dateTime: string
  formattedTime: string
  distanceTime: string
}) {
  const [isToggled, toggle] = useToggle()

  return (
    <time className='cursor-default' dateTime={props.dateTime} onClick={toggle}>
      {isToggled ? props.formattedTime : props.distanceTime}
    </time>
  )
}

export function BannerDeviceOnline() {
  const isOnline = useIsDeviceOnline()
  return (
    isOnline || (
      <div className='bg-destructive flex items-center justify-center gap-2 py-1 transition'>
        <WifiOffIcon />
        <p className='text-center text-sm font-bold leading-none text-white'>You're Offline</p>
      </div>
    )
  )
}
