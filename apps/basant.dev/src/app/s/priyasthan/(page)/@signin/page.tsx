import { PageLayoutFixed } from '../../shared.component'
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
