import type { PropsWithChildren } from 'react'

import { Button, type ButtonProps } from '~/components/ui/button'
import {
  FormControl as FormControlUi,
  FormSelect as FormSelectUi,
  type FormSelectProps,
} from '~/components/ui/form'
import { Input, type InputProps } from '~/components/ui/input'
import { useFieldContext, useFormContext } from './hooks'

export function FormSubmitButton(props: ButtonProps) {
  const form = useFormContext()
  return (
    <form.Subscribe>
      {(state) => <Button {...props} aria-disabled={!state.canSubmit} type='submit' />}
    </form.Subscribe>
  )
}

export type FormControlProps = {
  label?: string | false
  description?: string | null
}
export function FormControl(props: PropsWithChildren<FormControlProps>) {
  const field = useFieldContext()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormControlUi
      fieldId={field.name + field.form.formId}
      label={props.label ?? field.name.replace(/([A-Z])/g, ' $1')}
      description={props.description}
      errors={isInvalid ? field.state.meta.errors : undefined}>
      {props.children}
    </FormControlUi>
  )
}

export function FormInput(props: InputProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Input
      id={field.name + field.form.formId}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={isInvalid}
      {...props}
    />
  )
}

export function FormSelect(props: FormSelectProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormSelectUi
      {...props}
      fieldId={field.name + field.form.formId}
      name={field.name}
      value={field.state.value}
      onValueChange={field.handleChange}
      aria-invalid={isInvalid}
    />
  )
}
