import { cache } from 'react'

import { getSupabase } from '~/lib/supabase'

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
