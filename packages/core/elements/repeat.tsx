import { cloneElement, type ReactElement } from 'react'

export function Repeat(props: { count: number; children: ReactElement }) {
  return (
    <>
      {Array.from(Array(props.count), (_, index) => {
        return cloneElement(props.children!, { key: index })
      })}
    </>
  )
}
