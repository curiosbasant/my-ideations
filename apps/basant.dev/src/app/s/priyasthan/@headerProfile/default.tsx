import { Suspense } from 'react'

import { getProfileDetails } from '~/features/user/dal'

export default async function HeaderProfileSlot() {
  return (
    <Suspense fallback={<div className='ms-auto h-6 w-40 animate-pulse rounded-sm bg-secondary' />}>
      <HeaderProfile />
    </Suspense>
  )
}

async function HeaderProfile() {
  const profile = await getProfileDetails()
  if (!profile) return null
  return (
    <div className='ms-auto flex items-center gap-2'>
      <div className='size-8 shrink-0 overflow-clip rounded-full bg-secondary'>
        {profile.avatarUrl && <img src={profile.avatarUrl} className='size-full' />}
      </div>
      <span className='line-clamp-1 font-bold'>{profile.displayName}</span>
    </div>
  )
}
