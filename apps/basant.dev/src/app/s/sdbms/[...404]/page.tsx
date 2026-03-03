import type { Metadata } from 'next/types'
import { GlobeXIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: '404',
  description: 'Page not found',
}

export default function NotFoundPage() {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-2'>
      <GlobeXIcon className='size-16' />
      <h1 className='text-center text-7xl font-bold'>404</h1>
      <p className='text-center'>Oops... page not found!</p>
      <p className='text-muted-foreground text-balance text-center text-sm'>
        This might not be the page, you're looking for.
      </p>
    </div>
  )
}
