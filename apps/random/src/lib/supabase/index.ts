import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export type { EmailOtpType } from '@my/lib/supabase'

export function getSupabase() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    },
  )
}

export function getSupabaseMiddleware(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          for (const pair of request.headers) {
            response.headers.set(...pair)
          }
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          this.set!(name, '', options)
        },
      },
    },
  )
}
