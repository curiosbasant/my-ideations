import type { PropsWithChildren } from 'react'

import { Button, type ButtonProps } from '~/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '~/components/ui/field'
import { Input, type InputProps } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  type SelectProps,
  type SelectValueProps,
} from '~/components/ui/select'
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
    <Field data-invalid={isInvalid}>
      {props.label === false || (
        <FieldContent>
          <FieldLabel className='capitalize' htmlFor={field.name + field.form.formId}>
            {props.label || field.name.replace(/([A-Z])/g, ' $1')}
            <span className='text-muted-foreground group-has-required/field:hidden font-normal'>
              (optional)
            </span>
          </FieldLabel>
          {props.description && <FieldDescription>{props.description}</FieldDescription>}
        </FieldContent>
      )}
      {props.children}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
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

type FormSelectProps = SelectProps & SelectValueProps
export function FormSelect({ placeholder, ...props }: FormSelectProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Select
      name={field.name}
      value={field.state.value}
      onValueChange={field.handleChange}
      aria-invalid={isInvalid}
      {...props}>
      <SelectTrigger className='backdrop-blur-2xs w-full' id={field.name + field.form.formId}>
        <SelectValue placeholder={typeof placeholder === 'string' ? placeholder : '---'} />
      </SelectTrigger>
      <SelectContent position='item-aligned'>{props.children}</SelectContent>
    </Select>
  )
}
