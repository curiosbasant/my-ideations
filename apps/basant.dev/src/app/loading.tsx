'use client'

import { useEffect } from 'react'

import { Spinner } from '~/components/ui/spinner'

export default function RootLoading() {
  useEffect(() => {
    console.log('fisting')

    return () => {}
  }, [])

  return (
    <div className='flex size-full'>
      <Spinner className='text-primary m-auto' />
    </div>
  )
}
