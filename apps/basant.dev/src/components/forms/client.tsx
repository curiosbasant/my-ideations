'use client'

import type { PropsWithChildren } from 'react'
import { Loader2Icon } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import { Button } from '../ui/button'

export function FormSubmitButton(props: PropsWithChildren) {
  const { pending } = useFormStatus()
  return (
    <Button className='group grid place-items-center' aria-disabled={pending} type='submit'>
      <Loader2Icon className='col-start-1 row-start-1 size-5 text-primary-foreground transition-opacity group-not-aria-disabled:opacity-0 group-aria-disabled:animate-spin' />
      <span className='col-start-1 row-start-1 transition-opacity group-aria-disabled:opacity-0'>
        {props.children}
      </span>
    </Button>
  )
}
