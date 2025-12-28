import { PageLayoutFixed } from '~/components/layout'
import { SignInWithGoogleButton } from '~/features/auth/components/sign-in-with-google/client'

export default function Page() {
  return (
    <PageLayoutFixed>
      <div className='flex size-full items-center justify-center'>
        <SignInWithGoogleButton />
      </div>
    </PageLayoutFixed>
  )
}
