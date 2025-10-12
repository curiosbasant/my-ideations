import type { ComponentProps, CSSProperties } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/utils'

const spinnerVariants = cva('animate-spin rounded-full', {
  variants: {
    size: {
      sm: 'size-6 [--ring-size:4px]',
      md: 'size-12 [--ring-size:8px]',
      lg: 'size-24 [--ring-size:16px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface SpinnerProps extends ComponentProps<'div'>, VariantProps<typeof spinnerVariants> {}

const spinnerStyles: CSSProperties = {
  background:
    'radial-gradient(farthest-side,currentColor 100%,transparent) top/var(--ring-size) var(--ring-size) no-repeat, conic-gradient(transparent 30%,currentColor 98%)',
  mask: 'radial-gradient(farthest-side,transparent calc(100% - var(--ring-size)),#000 0)',
}

export function Spinner({ size, className, ...props }: SpinnerProps) {
  return (
    <div {...props} style={spinnerStyles} className={cn(spinnerVariants({ size, className }))} />
  )
}
