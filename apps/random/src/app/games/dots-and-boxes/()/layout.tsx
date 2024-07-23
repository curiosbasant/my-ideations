import type { PropsWithChildren } from 'react'

export default function Layout(props: PropsWithChildren) {
  return (
    <section className='m-auto w-full max-w-sm rounded-lg bg-white p-8 shadow-md shadow-sky-200'>
      {props.children}
    </section>
  )
}
