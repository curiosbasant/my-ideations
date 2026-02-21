import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server'

import { getSupabaseMiddleware } from '~/lib/supabase'
import { extractSubdomain } from '~/lib/utils/domain'
import { SIGN_IN_PATH } from './features/shared/constants'

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const subdomain = extractSubdomain(request.headers.get('host'))

  const rewriteTo = (url: string) => NextResponse.rewrite(new URL(url, request.url), { request })

  if (subdomain) {
    if (pathname === '/favicon.ico') {
      return rewriteTo(`/public/icons/${subdomain}.ico`)
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    const subdomainPath = (pathname === '/' ? '' : pathname) + search
    const response = rewriteTo(`/s/${subdomain + subdomainPath}`)

    if (subdomain === 'priyasthan' || subdomain === 'sdbms') {
      const supabase = getSupabaseMiddleware(request, response)
      const { data, error } = await supabase.auth.getClaims()
      const isAuthenticated = Boolean(!error && data?.claims)
      if (subdomain === 'sdbms' && pathname !== SIGN_IN_PATH && !isAuthenticated) {
        return NextResponse.redirect(
          new URL(`${SIGN_IN_PATH}?continue=${encodeURIComponent(subdomainPath)}`, request.url),
        )
      }
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
    '/((?!_next|api|public).*)',
  ],
}
