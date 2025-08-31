import { cache } from 'react'

import { getSupabase } from '~/lib/supabase'
import { api } from '~/lib/trpc'

export const getAuthUser = cache(async () => {
  const supabase = await getSupabase()
  return supabase.auth.getUser().then(({ data, error }) => {
    if (error) {
      console.log('Error fetching auth user:', error.message)
      return null
    }
    return data.user
  })
})

export const getUserLocation = cache(async () => {
  return api.user.address.get()
})
