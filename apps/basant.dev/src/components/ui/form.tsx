import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  type SelectProps,
  type SelectValueProps,
} from '~/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  type FieldProps,
} from './field'

export type FormControlProps =
  | {
      label: string
      labelClassName?: string
      fieldId?: string
      description?: string | null
      errors?: ({ message?: string } | undefined)[]
    }
  | {
      label: false
      errors?: ({ message?: string } | undefined)[]
    }

export function FormControl(props: FieldProps & FormControlProps) {
  // @ts-expect-error - Lemme destructure plz
  const { label, labelClassName, fieldId, description, errors, ...restProps } = props

  const renderLabel = () => {
    if (label === false) return null

    const labelJsx = (
      <FieldLabel className={labelClassName ?? 'capitalize'} htmlFor={fieldId}>
        {label}
        <span className='font-normal text-muted-foreground group-has-required/field:hidden'>
          (optional)
        </span>
      </FieldLabel>
    )
    if (!description) return labelJsx

    return (
      <FieldContent>
        {labelJsx}
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
    )
  }
  return (
    <Field data-invalid={!!errors} {...restProps}>
      {renderLabel()}
      {props.children}
      {errors && <FieldError errors={errors} />}
    </Field>
  )
}

export type FormSelectProps = SelectProps
  & SelectValueProps & {
    fieldId?: string
  }

export function FormSelect({ placeholder, fieldId, className, ...props }: FormSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className={'w-full backdrop-blur-2xs ' + className} id={fieldId}>
        <SelectValue placeholder={placeholder ?? '---'} />
      </SelectTrigger>
      <SelectContent position='item-aligned'>{props.children}</SelectContent>
    </Select>
  )
}
