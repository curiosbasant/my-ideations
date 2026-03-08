import type { PropsWithChildren } from 'react'

export function PageLayoutFixed(props: PropsWithChildren) {
  return (
    <div className='flex flex-1 bg-secondary px-(--page-padding)'>
      <main className='mx-auto w-full max-w-(--page-size) pt-8 pb-16'>{props.children}</main>
    </div>
  )
}

export function PageLayoutFluid(props: PropsWithChildren) {
  return (
    <div className='flex flex-1 bg-secondary'>
      <main className='flex-1'>{props.children}</main>
    </div>
  )
}
