import { MapPinIcon } from 'lucide-react'

import { getAuthUser, getUserLocation } from '~/features/auth/dal'
import { api } from '~/lib/trpc'
import {
  AutocompletePlaceSearch,
  SignInWithGoogleButton,
  UserLocationDetails,
} from './client.component'
import { saveCurrentWorkplace, savePreferredWorkplace } from './server.action'

export default async function PriyasthanPage() {
  const authUser = await getAuthUser()

  if (!authUser) {
    return <SignInWithGoogleButton />
  }

  return (
    <div className='space-y-12'>
      <section className='space-y-4'>
        <h2 className='text-xl font-bold'>My Current Workplace Location</h2>
        <CurrentWorkplaceLocation />
      </section>
      <section className='space-y-4'>
        <h2 className='text-xl font-bold'>My Preferred Work Locations</h2>
        <AutocompletePlaceSearch
          placeholder='Search for your preferred workplaces...'
          onPlaceSelect={savePreferredWorkplace}
        />
        <PreferredWorkplacesList />
      </section>
    </div>
  )
}

async function CurrentWorkplaceLocation() {
  const location = await getUserLocation()

  if (!location) {
    return (
      <AutocompletePlaceSearch
        placeholder='Search for your current workplace...'
        onPlaceSelect={saveCurrentWorkplace}
      />
    )
  }

  return <UserLocationDetails {...location} />
}

async function PreferredWorkplacesList() {
  const places = await api.priyasthan.workplace.getPreferred()
  return (
    <ul className='space-y-2'>
      {places.map((place) => (
        <li className='bg-background flex gap-2 rounded-md border p-4' key={place.placeId}>
          <MapPinIcon className='pointer-events-none size-6 shrink-0' />
          <div className='grid flex-1 gap-1'>
            <span className='leading-none'>{place.addressText}</span>
            {place.addressSecondaryText && (
              <span className='text-muted-foreground'>{place.addressSecondaryText}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
