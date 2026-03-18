import type { PropsWithChildren } from 'react'

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  type SelectProps,
  type SelectValueProps,
} from '~/components/ui/select'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from './field'

export type FormControlProps =
  | {
      label: string
      fieldId?: string
      description?: string | null
      errors?: ({ message?: string } | undefined)[]
    }
  | {
      label: false
      errors?: ({ message?: string } | undefined)[]
    }

export function FormControl(props: PropsWithChildren<FormControlProps>) {
  const renderLabel = () => {
    if (props.label === false) return null
    const labelJsx = (
      <FieldLabel className='capitalize' htmlFor={props.fieldId}>
        {props.label}
        <span className='font-normal text-muted-foreground group-has-required/field:hidden'>
          (optional)
        </span>
      </FieldLabel>
    )
    if (!props.description) return labelJsx

    return (
      <FieldContent>
        {labelJsx}
        <FieldDescription>{props.description}</FieldDescription>
      </FieldContent>
    )
  }
  return (
    <Field data-invalid={!!props.errors}>
      {renderLabel()}
      {props.children}
      {props.errors && <FieldError errors={props.errors} />}
    </Field>
  )
}

export type FormSelectProps = SelectProps
  & SelectValueProps & {
    fieldId?: string
  }

export function FormSelect({ placeholder, fieldId, ...props }: FormSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className='w-full backdrop-blur-2xs' id={fieldId}>
        <SelectValue placeholder={placeholder ?? '---'} />
      </SelectTrigger>
      <SelectContent position='item-aligned'>{props.children}</SelectContent>
    </Select>
  )
}
