import type { ButtonHTMLAttributes } from 'react'

export default function ServerListButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div className='px-3'>
      <button
        className='aspect-square w-full rounded-5xl bg-slate-50/20 font-icon text-slate-50 transition-all duration-300 hover:rounded-2xl'
        type='button'
        {...props}>
        add
      </button>
    </div>
  )
}
