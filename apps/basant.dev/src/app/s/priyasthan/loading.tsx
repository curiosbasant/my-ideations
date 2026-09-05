import { Spinner } from '~/components/elements/spinner'

export default function RootLoadingPage() {
  return (
    <div className='flex h-full flex-1 items-center justify-center'>
      <Spinner />
    </div>
  )
}
