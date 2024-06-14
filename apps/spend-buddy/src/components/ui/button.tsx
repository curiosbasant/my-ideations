import { Pressable, Text, type PressableProps } from 'react-native'

import { cn, cva, type VariantProps } from '~/lib/cva'
import { Icon, type IconName } from './icon'
import { Spinner } from './spinner'

const buttonVariants = cva('items-center justify-center rounded-md', {
  variants: {
    variant: {
      primary: 'bg-primary text-white hover:bg-opacity-90',
      destructive: 'bg-red-500 text-white hover:bg-opacity-90',
      outline: 'border border-primary bg-background hover:bg-accent hover:text-accent-foreground',
      // secondary: 'bg-secondary text-secondary-foreground hover:bg-opacity-80',
      // ghost: 'hover:bg-accent hover:text-accent-foreground',
      // link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      sm: 'h-9 rounded-md px-3',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps extends PressableProps, VariantProps<typeof buttonVariants> {
  loading?: boolean
  children: string
  labelClassName?: string
  icon?: IconName
}

const buttonLabelVariants = cva('font-bold tracking-wide', {
  variants: {
    variant: {
      primary: 'text-white',
      destructive: 'text-white',
      outline: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

export function Button(props: ButtonProps) {
  const { loading, icon, labelClassName, className, variant, size, children, ...restProps } = props
  const childrenClassName = cn(buttonLabelVariants({ variant, className: labelClassName }))

  return (
    <Pressable
      className={cn(
        icon && 'flex-row items-center gap-2',
        buttonVariants({ variant, size, className }),
        props.disabled && 'opacity-50',
      )}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      // Disable while loading spinner, override if explicitly passed
      disabled={loading}
      {...restProps}>
      {loading ? (
        <Spinner className={childrenClassName} />
      ) : (
        <>
          {icon && <Icon name={icon} className={childrenClassName} size={14} />}
          <Text className={childrenClassName}>{children}</Text>
        </>
      )}
    </Pressable>
  )
}
Button.displayName = 'ui/Button'
