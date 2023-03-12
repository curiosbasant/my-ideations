import { LayoutProps } from '~/types/utilities.type'
import Sidebar from './Sidebar'

export default function DiscordLayout({ children }: LayoutProps) {
  return (
    <div className='grid h-screen grid-cols-[4.5rem,1fr] grid-rows-1 items-stretch overflow-hidden font-sans text-slate-400'>
      {/* @ts-expect-error Server Component */}
      <Sidebar />
      <div className='flex flex-col'>
        {false && (
          <div className='-mb-4 bg-yellow-400 pb-4'>
            <p className='p-2 text-slate-600'>
              This is some notification which is important to give you!
            </p>
          </div>
        )}
        <div className='flex flex-1 gap-2 overflow-hidden rounded-t-xl bg-slate-800 only:rounded-none'>
          {children}
        </div>
      </div>
    </div>
  )
}
