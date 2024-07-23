'use client'

import type { PropsWithChildren } from 'react'
import { useFormStatus } from 'react-dom'

export function ActionButton(props: PropsWithChildren) {
  const { pending } = useFormStatus()
  return (
    <button
      className='w-full rounded-md bg-sky-500 px-4 py-2 text-white disabled:bg-slate-500'
      disabled={pending}
      type='submit'>
      {pending ? '...' : props.children}
    </button>
  )
}
