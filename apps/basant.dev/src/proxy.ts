import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server'

import { getSupabaseMiddleware } from '~/lib/supabase'
import { extractSubdomain } from '~/lib/utils/domain'

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const subdomain = extractSubdomain(request.headers.get('host'))

  const rewriteTo = (url: string) => NextResponse.rewrite(new URL(url, request.url))

  if (subdomain) {
    if (pathname === '/favicon.ico') {
      return rewriteTo(`/public/icons/${subdomain}.ico`)
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    const response = rewriteTo(`/s/${subdomain + (pathname === '/' ? '' : pathname) + search}`)

    if (subdomain === 'priyasthan') {
      const supabase = getSupabaseMiddleware(request, response)
      await supabase.auth.getUser()
    }

    return response
  }

  if (pathname.startsWith('/s/')) {
    return rewriteTo('/not-found')
  }

  // On the root domain, allow normal access
  return NextResponse.next()
}

export const config: ProxyConfig = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all files inside /public
     */
    '/((?!api|_next|public).*)',
  ],
}
