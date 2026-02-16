import type { PropsWithChildren } from 'react'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Select, type SelectProps } from '~/components/ui/select'
import { useFieldContext } from './hooks'

export type FormControlProps = {
  label: string
  description?: string | null
}

export function FormField(props: PropsWithChildren<FormControlProps>) {
  const field = useFieldContext()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{props.label}</FieldLabel>
        {props.description && <FieldDescription>{props.description}</FieldDescription>}
      </FieldContent>
      {props.children}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function FormInput() {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Input
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={isInvalid}
    />
  )
}

export function FormSelect(props: SelectProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Select
      name={field.name}
      value={field.state.value}
      onValueChange={field.handleChange}
      aria-invalid={isInvalid}
      {...props}
    />
  )
}
