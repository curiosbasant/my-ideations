import { LoaderCircleIcon } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className='flex size-full items-center justify-center'>
      <LoaderCircleIcon className='size-8 shrink-0 animate-spin md:size-10' />
    </div>
  )
}
