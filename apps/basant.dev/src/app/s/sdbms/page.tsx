import { SignInWithGoogleButton } from '~/features/auth/components/sign-in-with-google/client'
import { getProfileDetails } from '~/features/user/dal'
import { ConnectProfileForm } from './client'

export default async function SdbmsHomePage() {
  const profile = await getProfileDetails()

  return (
    <div className='h-full'>
      {!profile ?
        <SignInWithGoogleButton />
      : profile.personId ?
        <p className='text-center font-bold text-emerald-500'>
          Success! Your profile is now connected with the provided SR Number.
        </p>
      : <ConnectProfileForm />}
    </div>
  )
}
