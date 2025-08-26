import { NextResponse, type NextRequest } from 'next/server'

import { ROOT_DOMAIN } from '~/lib/env'
import { getSupabaseMiddleware } from '~/lib/supabase'
import { extractSubdomain } from '~/lib/utils/domain'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const subdomain = extractSubdomain(request)

  if (subdomain) {
    if (pathname === '/favicon.ico') {
      return NextResponse.rewrite(new URL(`/icons/${subdomain}.ico`, request.url))
    }

    const response = NextResponse.rewrite(
      // For the root path on a subdomain, rewrite to the subdomain page
      new URL(`/s/${subdomain + (pathname === '/' ? '' : pathname) + search}`, request.url),
      { headers: request.headers },
    )

    if (subdomain === 'priyasthan') {
      const supabase = getSupabaseMiddleware(request, response)
      await supabase.auth.getUser()
    }

    return response
  }

  if (pathname.startsWith('/s/')) {
    const { subdomain, restPath } =
      pathname.match(/\/s\/(?<subdomain>[^\/]+)(?<restPath>.*)/)?.groups ?? {}

    return NextResponse.redirect(
      new URL(`${request.nextUrl.protocol}//${subdomain}.${ROOT_DOMAIN + restPath + search}`),
      { headers: request.headers },
    )
  }

  // On the root domain, allow normal access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all files inside /public
     */
    '/((?!api|_next|.*\\..*).*)',
    '/favicon.ico',
  ],
}
