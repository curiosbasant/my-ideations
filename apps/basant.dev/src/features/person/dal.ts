import { redirect } from 'next/navigation'

import { getProfileDetails } from '~/features/user/dal'

export async function ensurePersonId() {
  const profile = await getProfileDetails()
  if (profile?.personId) return profile.personId

  redirect('/')
}
