import { unstable_cache as cache } from 'next/cache'

import { getSupabase } from '~/lib/supabase'

export const getPublicUrlFromShortcode = cache(async (shortcode: string) => {
  const supabase = await getSupabase()
  const { data } = await supabase
    .from('snapfile__short_url')
    .select('url')
    .eq('code', shortcode)
    .single()
    .throwOnError()
  return data.url
})
