import type { ReactNode } from 'react'

export function For<const T>(props: {
  each: T[]
  children: (item: T, index: number) => ReactNode
}) {
  return <>{props.each.map(props.children)}</>
}
