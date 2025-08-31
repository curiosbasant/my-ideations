import { Spinner } from '~/components/elements/spinner'

export default function RootLoadingPage() {
  return (
    <div className='flex h-full items-center justify-center'>
      <Spinner />
    </div>
  )
}
