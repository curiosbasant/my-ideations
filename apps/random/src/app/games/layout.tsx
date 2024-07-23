import type { PropsWithChildren } from 'react'
import Link from 'next/link'

export default function GamesLayout(props: PropsWithChildren) {
  return (
    <div className='flex h-screen flex-col bg-sky-100 text-slate-500'>
      <header className='sticky top-0 bg-sky-500 px-4 shadow-lg shadow-sky-200'>
        <div className='mx-auto flex h-16 max-w-7xl items-center'>
          <Link href='/games' className='text-3xl font-bold text-white'>
            Games
          </Link>
        </div>
      </header>
      <div className='flex-1 px-4'>
        <main className='mx-auto flex h-full max-w-7xl py-8'>{props.children}</main>
      </div>
    </div>
  )
}
