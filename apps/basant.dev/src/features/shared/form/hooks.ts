import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import { FormControl, FormInput, FormSelect, FormSubmitButton } from './elements'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Input: FormInput,
    Select: FormSelect,
  },
  formComponents: {
    Control: FormControl,
    SubmitButton: FormSubmitButton,
  },
})
