import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import { FormInput, FormSelect } from './elements'

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()
export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Input: FormInput,
    Select: FormSelect,
  },
  formComponents: {},
})
