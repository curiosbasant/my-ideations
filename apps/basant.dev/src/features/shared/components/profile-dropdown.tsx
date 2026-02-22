import { Suspense } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { actionSignOut } from '~/features/auth/actions'
import { getProfileDetails } from '~/features/user/dal'

export function ProfileDropdownMenu() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center gap-3'>
          <div className='bg-muted size-8 animate-pulse rounded-full' />
          <div className='bg-muted h-6 w-32 animate-pulse rounded-md' />
        </div>
      }>
      <ProfileDropdownMenuInner />
    </Suspense>
  )
}

async function ProfileDropdownMenuInner() {
  const profile = await getProfileDetails()
  if (!profile) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus-visible:border-ring focus-visible:outline-3 focus-visible:outline-ring/50 flex items-center gap-3 rounded-md outline-offset-4'>
        <Avatar>
          <AvatarImage src={profile.avatarUrl || ''} alt={`${profile.displayName} Photo`} />
          <AvatarFallback>{getNameInitials(profile.displayName)}</AvatarFallback>
        </Avatar>
        {profile.displayName && <span className='@max-xl:hidden'>{profile.displayName}</span>}
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        <DropdownMenuItem variant='destructive' onSelect={actionSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getNameInitials(fullName?: string | null) {
  if (!fullName) return 'AA'
  const parts = fullName.split(/ +/)
  if (parts.length === 1) return fullName.slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
