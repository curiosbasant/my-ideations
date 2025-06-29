import { useRef } from 'react'

export function* useRefs<T>(initialValue: T) {
  for (;;) yield useRef(initialValue)
}
