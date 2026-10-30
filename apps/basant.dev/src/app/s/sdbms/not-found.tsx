import type { Metadata } from 'next/types'
import { GlobeXIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 Not Found',
  description: 'Resource not found',
}

export default function NotFoundPage() {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-4'>
      <GlobeXIcon className='size-16' />
      <h1 className='text-center text-7xl font-bold'>Error 404</h1>
      <p className='text-center uppercase'>Not Found</p>
      <p className='text-center text-sm text-balance text-muted-foreground'>
        We can't seem to find the resource you are looking for.
      </p>
    </div>
  )
}
