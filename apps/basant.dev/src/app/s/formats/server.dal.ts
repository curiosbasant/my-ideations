import type { Tables } from '@my/lib/supabase/types.gen'

import { getSupabase } from '~/lib/supabase'

export async function getRecentFormats({ query }: { query?: string | null } = {}) {
  const supabase = await getSupabase()

  const q = supabase
    .from('format__file')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  if (query) {
    q.ilike('name', `%${query}%`)
  }
  const { data, error } = await q

  if (error) {
    console.error('Error fetching recent formats:', error)
    return []
  }

  return data
}

export type Format = Tables<'format__file'>
