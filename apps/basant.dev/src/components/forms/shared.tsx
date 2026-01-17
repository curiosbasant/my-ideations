import type { ComponentProps } from 'react'

import { cn } from '~/lib/utils'
import { Label } from '../ui/label'

export function FormField(props: ComponentProps<'div'> & { label: string }) {
  const { label, ...rest } = props
  return (
    <div {...rest} className={cn('group space-y-2', props.className)}>
      <div className='flex items-center gap-2'>
        <Label className='text-lg font-bold'>{label}</Label>
        <span className='text-muted-foreground group-has-required:hidden'>(optional)</span>
      </div>
      {props.children}
    </div>
  )
}
