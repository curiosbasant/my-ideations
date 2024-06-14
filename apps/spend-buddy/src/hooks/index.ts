import { useReducer, useRef } from 'react'

export function useToggle(initialState?: boolean | (() => boolean)) {
  return (
    typeof initialState === 'function'
      ? useReducer(useToggle.reducer, false, initialState)
      : useReducer(useToggle.reducer, initialState ?? false)
  ) as [boolean, (value?: unknown) => boolean]
}
useToggle.reducer = (prevValue: boolean, value: unknown) =>
  typeof value === 'boolean' ? value : !prevValue

export function* useRefs<T>(initialValue: T) {
  for (;;) yield useRef(initialValue)
}
