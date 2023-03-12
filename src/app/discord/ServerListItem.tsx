'use client'

import { PropsWithChildren } from 'react'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

export default function ServerListItem(
  props: PropsWithChildren<{
    href: LinkProps['href']
    active?: boolean
    iconUrl?: string | null
    name: string
    pingCount?: number
  }>
) {
  const pathname = usePathname()
  const active = pathname?.startsWith(
    typeof props.href === 'string' ? props.href : props.href.pathname!
  )

  return (
    <li className='relative -mt-12 transition-all duration-300 first:mt-auto group-[:has([data-toggle-folder]:checked)]:mt-2 group-[:not(:has([data-toggle-folder]:checked))]:opacity-0'>
      <Link
        className={`peer relative mx-3 block aspect-square h-full ${
          active ? 'rounded-2xl' : 'rounded-5xl hover:rounded-2xl'
        } bg-slate-50/20 text-center transition-all duration-300 hover:bg-indigo-500 hover:text-white`}
        title={props.name}
        href={props.href}>
        {props.children ? (
          props.children
        ) : props.iconUrl ? (
          <Image
            className='rounded-inherit object-cover object-center'
            src={props.iconUrl}
            alt={`${props.name}'s icon`}
            fill
          />
        ) : (
          <span className='text-xl uppercase leading-12'>{props.name[0]}</span>
        )}
        <span className='absolute top-0 right-0 z-10 rounded-full bg-emerald-500 p-0.5 text-center font-icon text-xs text-white'>
          volume_up
        </span>
        {props.pingCount! > 0 && (
          <span className='absolute bottom-0 right-0 z-10 rounded-full bg-rose-500 py-0.5 px-1 text-center text-xs leading-none text-white'>
            {props.pingCount}
          </span>
        )}
      </Link>
      <span
        className={`absolute top-1/2 left-0 w-1 ${
          active ? 'h-3/4' : `${true ? 'h-1/5' : 'h-0'} peer-hover:h-1/2`
        } -translate-y-1/2 rounded-r-full bg-slate-50 transition-all duration-300`}
      />
    </li>
  )
}
