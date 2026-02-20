import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

import {
  cookieOptions,
  createServerClient,
  type CookieMethodsServer,
  type Database,
} from '@my/lib/supabase'

export async function getSupabase() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      } satisfies CookieMethodsServer,
    },
  )
}

export function getSupabaseMiddleware(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // refreshed auth token for Server Components
          cookiesToSet.forEach((c) => request.cookies.set(c))
          for (const pair of request.headers) {
            response.headers.set(...pair)
          }
          // refresh auth token for the browser
          cookiesToSet.forEach((c) => response.cookies.set(c))
        },
      } satisfies CookieMethodsServer,
    },
  )
}
