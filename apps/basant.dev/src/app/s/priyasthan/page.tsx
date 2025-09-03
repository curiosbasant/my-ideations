import { MapPinIcon, MapPinnedIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { getAuthUser, getUserLocation } from '~/features/auth/dal'
import { api } from '~/lib/trpc'
import {
  SetCurrentLocationDialog,
  SetPreferredLocationDialog,
  SignInWithGoogleButton,
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
        <SetPreferredLocationDialog />
        <PreferredWorkplacesList />
      </section>
    </div>
  )
}

async function CurrentWorkplaceLocation() {
  const location = await getUserLocation()

  if (!location) {
    return (
      <SetCurrentLocationDialog>
        <Button>
          <MapPinnedIcon /> Set Your Location
        </Button>
      </SetCurrentLocationDialog>
    )
  }

  return (
    <div className='bg-background flex space-y-1 rounded-md border p-4'>
      <div className='flex-1'>
        <div className='font-medium'>{location.addressText}</div>
        {location.addressSecondaryText && (
          <p className='text-muted-foreground text-sm'>{location.addressSecondaryText}</p>
        )}
      </div>
      <SetCurrentLocationDialog>
        <Button>
          <MapPinnedIcon /> Edit
        </Button>
      </SetCurrentLocationDialog>
    </div>
  )
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
