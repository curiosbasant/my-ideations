import { startTransition, useActionState } from 'react'

import { toast } from '~/components/ui/sonner'
import { dalFormatErrorMessage } from './helpers'
import type { DalResult } from './types'

export function useDalMutation<TInput, TData>(
  dalActionFn: (payload: TInput) => Promise<DalResult<TData>>,
  options: {
    initialData?: NoInfer<TData>
    onSuccess?: (data: TData, payload: TInput) => void
    onError?: (message: string, payload: TInput) => void
  } = {},
) {
  const reducer = async (_prev: DalResult<TData> | null, payload: TInput) => {
    const result = await dalActionFn(payload)
    if (result.success) {
      options.onSuccess?.(result.data, payload)
    } else {
      const errorMessage = dalFormatErrorMessage(result.error)
      toast.error(errorMessage)
      options.onError?.(errorMessage, payload)
    }
    return result
  }
  const [state, action, isPending] = useActionState(reducer, null)
  const actionTransition = (payload: TInput) => {
    startTransition(() => action(payload))
  }
  const errorMessage = formatError(state)
  return state ?
      { ...state, errorMessage, action, actionTransition, isPending }
    : { success: false as const, error: null, errorMessage, action, actionTransition, isPending }
}

function formatError(result: DalResult<any> | null) {
  if (!result || result.success) return null
  const error = 'error' in result.error ? result.error.error : result.error
  const defaultErrorMessage = 'An unknown error occurred!'
  if (typeof error === 'string') return error || defaultErrorMessage
  if (error instanceof Error) return error.message || defaultErrorMessage
  return defaultErrorMessage
}
