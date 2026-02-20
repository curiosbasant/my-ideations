import { startTransition, useActionState } from 'react'

import type { ActionState } from './shared'

export type ActionFn<Input, Output> = (
  state: Awaited<ActionState<Output>>,
  payload: Input,
) => Promise<ActionState<Output>>

export function useAction<Input, Output>(options: {
  actionFn: ActionFn<Input, Output>
  onSuccess?: (data: Output, variable: Input) => void
  onError?: (message: string, variable: Input) => void
}) {
  const [state, actionFn, isPending] = useActionState(
    async (state: Awaited<ActionState<Output>>, payload: Input) => {
      const result = await options.actionFn(state, payload)
      if (result?.success) {
        options.onSuccess?.(result.data, payload)
      } else if (result) {
        options.onError?.(result.message, payload)
      }
      return result
    },
    null,
  )

  return {
    isPending,
    state,
    actionTransition(b: Input) {
      startTransition(() => actionFn(b))
    },
  }
}
