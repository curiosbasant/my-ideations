'use client'

import type { PropsWithChildren } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next/types'

import { Button } from '~/components/ui/button'

export function HeaderNavItem(props: PropsWithChildren<{ path: Route }>) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(props.path)

  return (
    <Button className='text-base' variant='ghost' size='sm' asChild>
      <Link href={props.path} className={isActive ? 'bg-secondary/25 text-primary' : undefined}>
        {props.children}
      </Link>
    </Button>
  )
}
