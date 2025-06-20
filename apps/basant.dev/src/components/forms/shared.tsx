import type { PropsWithChildren } from 'react'
import { Label } from '../ui/label'

export function FormField(props: PropsWithChildren<{ label: string; placeholder?: string }>) {
  return (
    <div className='space-y-2'>
      <Label className='text-lg font-bold'>{props.label}</Label>
      {props.children}
    </div>
  )
}
