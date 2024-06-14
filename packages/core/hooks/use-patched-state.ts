import { useReducer, type Dispatch } from 'react'

import { applyPatches, produceWithPatches, type Draft, type Objectish, type Patch } from '../immer'

type State<T> = {
  currentState: T
  patchStack: Patch[][]
  inversePatchStack: Patch[][]
  stackPointer: number
}

const getInitialState = <T>(currentState: T): State<T> => ({
  currentState,
  patchStack: [],
  inversePatchStack: [],
  stackPointer: -1,
})

export function usePatchedState<T extends Record<string, any> | any[]>(
  initialState: T,
): [T, Dispatch<Action<T>>] {
  const [state, dispatch] = useReducer(reducer, initialState, getInitialState)
  // @ts-expect-error
  return [state.currentState, dispatch] as const
}

type Action<T> = 'undo' | 'redo' | ((payload: Draft<T>) => Draft<T> | void | undefined)

function reducer<T extends Objectish>(draft: State<T>, action: Action<T>): State<T> {
  const { currentState, patchStack, inversePatchStack, stackPointer } = draft

  if (action === 'undo') {
    if (stackPointer < 0) return draft
    const patches = inversePatchStack[stackPointer]
    const nextState = applyPatches(currentState, patches)
    return { ...draft, currentState: nextState, stackPointer: stackPointer - 1 }
  }

  if (action === 'redo') {
    const nextPointer = stackPointer + 1
    if (nextPointer < 0 || nextPointer >= patchStack.length) return draft
    const patches = patchStack[nextPointer]
    const nextState = applyPatches(currentState, patches)
    return { ...draft, currentState: nextState, stackPointer: nextPointer }
  }

  const [nextState, patches, inversePatches] = produceWithPatches(currentState, action)
  if (currentState === nextState) return draft

  const nextPointer = stackPointer + 1
  patchStack.length = nextPointer
  inversePatchStack.length = nextPointer
  patchStack[nextPointer] = patches
  inversePatchStack[nextPointer] = inversePatches
  return { ...draft, currentState: nextState, stackPointer: nextPointer }
}
