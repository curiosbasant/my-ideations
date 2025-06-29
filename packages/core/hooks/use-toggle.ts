import { useReducer } from 'react'

const reducer = (prevValue: boolean, value: unknown) =>
  typeof value === 'boolean' ? value : !prevValue

/**
 * @default false
 */
export function useToggle(initialState?: boolean | (() => boolean)) {
  return (
    typeof initialState === 'function' ?
      useReducer(reducer, false, initialState)
    : useReducer(reducer, initialState ?? false)) as [boolean, (value?: unknown) => boolean]
}
