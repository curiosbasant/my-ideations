import { PageLayoutFixed } from '~/components/layout'
import { SignInWithGoogleButton } from './client.component'

export default function Page() {
  return (
    <PageLayoutFixed>
      <div className='flex size-full items-center justify-center'>
        <SignInWithGoogleButton />
      </div>
    </PageLayoutFixed>
  )
}
