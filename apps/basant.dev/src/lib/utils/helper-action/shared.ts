type ActionSuccessState<Output> = {
  success: true
  message?: string
  data: Output
}
type ActionFailedState = {
  success: false
  message: string
  data?: null
}
export type ActionState<Output> = ActionSuccessState<Output> | ActionFailedState | null

type ActionHandler<Input, Output> = (payload: Input, state: ActionState<Output>) => Promise<Output>

export function createAction<Input, Output>(action: ActionHandler<Input, Output>) {
  return async (state: ActionState<Output>, payload: Input): Promise<ActionState<Output>> => {
    try {
      const data = await action(payload, state)
      return { success: true, data }
    } catch (error) {
      const message = String(error)
      if (message === 'Error: NEXT_REDIRECT') throw error
      return { success: false, message }
    }
  }
}
