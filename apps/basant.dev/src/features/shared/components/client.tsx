'use client'

import { WifiOffIcon } from 'lucide-react'

import { useIsDeviceOnline, useToggle } from '@my/core/hooks'

export function TimeFormat(props: {
  className?: string
  dateTime: string
  formattedTime: string
  distanceTime: string
}) {
  const [isToggled, toggle] = useToggle()

  return (
    <time className={props.className} dateTime={props.dateTime} onClick={toggle}>
      {isToggled ? props.formattedTime : props.distanceTime}
    </time>
  )
}

export function BannerDeviceOnline() {
  const isOnline = useIsDeviceOnline()
  return (
    isOnline || (
      <div className='flex items-center justify-center gap-2 bg-destructive py-1 transition'>
        <WifiOffIcon />
        <p className='text-center text-sm leading-none font-bold text-white'>You're Offline</p>
      </div>
    )
  )
}
