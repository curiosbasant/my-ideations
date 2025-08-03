import { startTransition, useActionState } from 'react'

import type { ActionState } from '~/app/shared'

export function useAction<TData, Payload>(params: {
  actionFn: (state: Awaited<ActionState<TData>>, payload: Payload) => Promise<ActionState<TData>>
  onSuccess?: (data: TData) => void
  onError?: (message: string) => void
}) {
  const [state, actionFn, isPending] = useActionState(
    async (state: Awaited<ActionState<TData>>, payload: Payload) => {
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
    actionTransition(b: Payload) {
      startTransition(() => actionFn(b))
    },
  }
}
