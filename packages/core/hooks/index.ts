import { useEffect, useReducer, useRef } from 'react'

export * from './use-debounce-callback'
export * from './use-local-storage'
export * from './use-timer'

/**
 * @default false
 */
export function useToggle(initialState?: boolean | (() => boolean)) {
  return (
    typeof initialState === 'function' ?
      useReducer(useToggle.reducer, false, initialState)
    : useReducer(useToggle.reducer, initialState ?? false)) as [
    boolean,
    (value?: unknown) => boolean,
  ]
}
useToggle.reducer = (prevValue: boolean, value: unknown) =>
  typeof value === 'boolean' ? value : !prevValue

export function* useRefs<T>(initialValue: T) {
  for (;;) yield useRef(initialValue)
}

export function useIsOnClient() {
  const [bool, toggle] = useToggle()
  useEffect(() => void toggle(true), [])
  return bool
}
