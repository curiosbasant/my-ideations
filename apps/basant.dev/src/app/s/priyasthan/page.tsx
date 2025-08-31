import { getAuthUser, getUserLocation } from '~/features/auth/dal'
import { CurrentWorkplaceSearch, SignInWithGoogleButton } from './client.component'

export default async function PriyasthanPage() {
  const authUser = await getAuthUser()

  if (!authUser) {
    return <SignInWithGoogleButton />
  }

  return (
    <div className='space-y-2'>
      <h2 className='text-xl font-bold'>Your Workplace Location</h2>
      <CurrentWorkplaceLocation />
    </div>
  )
}

async function CurrentWorkplaceLocation() {
  const location = await getUserLocation()

  if (!location) {
    return <CurrentWorkplaceSearch />
  }

  return (
    <div className='bg-background space-y-1 rounded-md border p-4'>
      <div className='font-medium'>{location.addressText}</div>
      {location.addressSecondaryText && (
        <p className='text-muted-foreground text-sm'>{location.addressSecondaryText}</p>
      )}
    </div>
  )
}
