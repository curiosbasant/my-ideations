import { Spinner } from '~/components/ui/spinner'

export default function RootLoading() {
  return (
    <div className='flex size-full'>
      <Spinner className='text-primary m-auto' />
    </div>
  )
}
