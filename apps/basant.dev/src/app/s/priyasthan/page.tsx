import { MapPinIcon, MapPinnedIcon } from 'lucide-react'

import { formatDistance } from '@my/lib/date'

import { SubmitButton } from '~/app/client.component'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { getAuthUser, getUserLocation } from '~/features/auth/dal'
import { getDepartments, getProfileDetails } from '~/features/user/dal'
import { api } from '~/lib/trpc'
import { handleDesignationUpdate } from './client.action'
import {
  DepartmentDesignation,
  SetCurrentLocationDialog,
  SetPreferredLocationDialog,
  SignInWithGoogleButton,
} from './client.component'

export default async function PriyasthanPage() {
  const authUser = await getAuthUser()

  if (!authUser) {
    return <SignInWithGoogleButton />
  }

  return (
    <div className='grid auto-rows-auto gap-12 md:grid-flow-col md:grid-cols-[2fr_1fr] md:grid-rows-[auto_1fr]'>
      <section className='@container space-y-4'>
        <h2 className='text-xl font-bold'>My Details</h2>
        <MyDetailsForm />
      </section>
      <section className='space-y-4'>
        <h2 className='text-xl font-bold'>My Preferred Work Locations</h2>
        <SetPreferredLocationDialog />
        <PreferredWorkplacesList />
      </section>
      <aside className='row-span-2 space-y-4'>
        <header className=''>
          <h2 className='text-xl font-bold'>Latest Preferred Locations</h2>
        </header>
        <RecentLocations />
      </aside>
    </div>
  )
}

async function MyDetailsForm() {
  const profile = await getProfileDetails()

  return (
    <form className='@xl:grid-cols-2 grid gap-8' action={handleDesignationUpdate}>
      <DepartmentDesignation
        departments={getDepartments()}
        defaultDepartmentId={profile?.designation?.departmentId}
        defaultDesignation={profile?.designation?.name}
      />
      <div className='col-span-full space-y-2'>
        <Label>Workplace Location</Label>
        <CurrentWorkplaceLocation />
      </div>
      <div className='col-span-full justify-self-end'>
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
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
        <Button variant='secondary'>
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

async function RecentLocations() {
  const recentPlaces = await api.priyasthan.workplace.recent()

  return (
    <ul className='grid grid-cols-[auto_1fr] gap-2'>
      {recentPlaces.map(({ profile, address, createdAt }) => (
        <li
          className='bg-background col-span-full row-span-3 grid grid-cols-subgrid rounded-md border p-3'
          key={profile.id + address.id}>
          <div className='size-8 overflow-clip rounded-full'>
            {profile.avatarUrl && <img src={profile.avatarUrl} className='size-full' />}
          </div>
          <p>
            <strong>{profile.displayName}</strong> has set their preferred work place at{' '}
            <strong>{address.text}</strong>.
          </p>
          <time
            dateTime={createdAt.toString()}
            className='text-muted-foreground col-start-2 justify-self-end text-sm'>
            {formatDistance(createdAt)}
          </time>
        </li>
      ))}
    </ul>
  )
}
