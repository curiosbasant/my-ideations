import { PropsWithChildren } from 'react'

export default function PanelTop({ children }: PropsWithChildren) {
  return (
    <div className='flex shrink-0 basis-12 items-center border-b border-slate-800/50 px-2 shadow'>
      {children}
    </div>
  )
}
