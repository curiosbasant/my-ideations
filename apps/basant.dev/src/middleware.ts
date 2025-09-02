import { NextResponse, type MiddlewareConfig, type NextRequest } from 'next/server'

import { getSupabaseMiddleware } from '~/lib/supabase'
import { extractSubdomain } from '~/lib/utils/domain'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const subdomain = extractSubdomain(request)

  if (subdomain) {
    if (pathname === '/favicon.ico') {
      return NextResponse.rewrite(new URL(`/icons/${subdomain}.ico`, request.url), {
        headers: request.headers,
      })
    }

    const response = NextResponse.rewrite(
      // For the root path on a subdomain, rewrite to the subdomain page
      new URL(`/s/${subdomain + (pathname === '/' ? '' : pathname) + search}`, request.url),
    )

    if (subdomain === 'priyasthan') {
      const supabase = getSupabaseMiddleware(request, response)
      await supabase.auth.getUser()
    }

    return response
  }

  if (pathname.startsWith('/s/')) {
    return NextResponse.redirect(new URL('/not-found', request.url), { headers: request.headers })
  }

  // On the root domain, allow normal access
  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: [
    '/favicon.ico',
      /*
       * Match all paths except for:
       * 1. /api routes
       * 2. /_next (Next.js internals)
       * 3. all files inside /public
       */
    '/((?!api|_next|.*\\..*).*)',
  ],
}
