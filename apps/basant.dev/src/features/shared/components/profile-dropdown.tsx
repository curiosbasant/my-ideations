import { Suspense } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { getProfileDetails } from '~/features/user/dal'

export function ProfileDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus-visible:border-ring focus-visible:outline-3 focus-visible:outline-ring/50 flex items-center gap-3 rounded-md outline-offset-4'>
        <Avatar>
          <Suspense fallback={<div className='bg-muted size-full animate-pulse' />}>
            <ProfileAvatar />
          </Suspense>
        </Avatar>
        <Suspense fallback={<div className='bg-muted h-6 w-32 animate-pulse rounded-md' />}>
          <ProfileDisplayName />
        </Suspense>
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        <DropdownMenuItem variant='destructive'>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

async function ProfileAvatar() {
  const profile = await getProfileDetails()

  return profile ?
      <>
        <AvatarImage src={profile.avatarUrl || ''} alt={`${profile.displayName} Photo`} />
        <AvatarFallback>{getNameInitials(profile.displayName)}</AvatarFallback>
      </>
    : <div className='bg-muted size-full' />
}

function getNameInitials(fullName?: string | null) {
  if (!fullName) return 'AA'
  const parts = fullName.split(/ +/)
  if (parts.length === 1) return fullName.slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

async function ProfileDisplayName() {
  const profile = await getProfileDetails()

  return profile?.displayName && <span>{profile.displayName}</span>
}
