import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

import { env } from '~/lib/env'

export type { EmailOtpType } from '@my/lib/supabase'

export function getSupabase() {
  const cookieStore = cookies()

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach((c) => cookieStore.set(c.name, c.value, c.options))
        } catch (_) {
          // Ignore cookies that can't be set in Server Components
        }
      },
    },
  })
}

export function getSupabaseMiddleware(request: NextRequest, response: NextResponse) {
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((c) => request.cookies.set(c.name, c.value))
        for (const pair of request.headers) {
          response.headers.set(...pair)
        }
        cookiesToSet.forEach((c) => response.cookies.set(c.name, c.value, c.options))
      },
    },
  })
}
