import { notFound } from 'next/navigation'

import { getSupabase } from '~/lib/supabase'

export const getPublicUrlFromShortcode = async (shortcode: string) => {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('snapfile__short_url')
    .select('url')
    .eq('code', shortcode)
    .single()
  if (error) notFound()
  return data.url
}
