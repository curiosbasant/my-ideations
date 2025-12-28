import { startTransition, useActionState } from 'react'

import type { ActionState } from './shared'

export type ActionFn<Input, Output> = (
  state: Awaited<ActionState<Output>>,
  payload: Input,
) => Promise<ActionState<Output>>

export function useAction<Input, Output>(params: {
  actionFn: ActionFn<Input, Output>
  onSuccess?: (data: Output) => void
  onError?: (message: string) => void
}) {
  const [state, actionFn, isPending] = useActionState(
    async (state: Awaited<ActionState<Output>>, payload: Input) => {
      const result = await params.actionFn(state, payload)
      if (result?.success) {
        params.onSuccess?.(result.data)
      } else if (result) {
        params.onError?.(result.message)
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
