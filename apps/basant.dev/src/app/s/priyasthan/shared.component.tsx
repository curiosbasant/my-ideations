import type { PropsWithChildren } from 'react'

export function PageLayoutFixed(props: PropsWithChildren) {
  return (
    <div className='px-(--page-padding) bg-secondary flex flex-1'>
      <main className='max-w-(--page-size) mx-auto w-full pb-16 pt-8'>{props.children}</main>
    </div>
  )
}

export function PageLayoutFluid(props: PropsWithChildren) {
  return (
    <div className='bg-secondary flex flex-1'>
      <main className='flex-1'>{props.children}</main>
    </div>
  )
}
