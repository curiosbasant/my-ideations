import { getAuthUser } from '~/features/auth/dal'
import { SignInWithGoogleButton } from './client.component'

export default async function PriyasthanPage() {
  const authUser = await getAuthUser()

  return (
    <div className='flex h-full items-center justify-center'>
      {authUser ?
        <div>Welcome, {authUser.email}</div>
      : <SignInWithGoogleButton />}
    </div>
  )
}
