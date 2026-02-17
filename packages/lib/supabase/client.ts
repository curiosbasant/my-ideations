import { createBrowserClient } from '@supabase/ssr'

import { cookieOptions } from './shared'
import type { Database } from './types.gen'

export function getSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions,
    },
  )
}
