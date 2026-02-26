import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server'

import { SIGN_IN_PATH } from '~/features/shared/constants'
import { getSupabaseMiddleware } from '~/lib/supabase'
import { extractSubdomain } from '~/lib/utils/domain'

type RouteConfig = {
  subdomain: string | string[]
  /** If no public paths are specified, it would treat all pages as public under the specified subdomain */
  publicPaths?: string[]
  authRedirectPath?: string
}

const routesConfig: RouteConfig[] = [
  {
    subdomain: 'priyasthan',
    publicPaths: ['/'],
    authRedirectPath: '/',
  },
  {
    subdomain: 'sdbms',
    publicPaths: [],
    authRedirectPath: SIGN_IN_PATH,
  },
]

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const subdomain = extractSubdomain(request.headers.get('host'))

  const rewriteTo = (url: string) => NextResponse.rewrite(new URL(url, request.url))

  if (!subdomain) {
    if (pathname.startsWith('/s/')) {
      return rewriteTo('/not-found')
    }

    // On the root domain, allow normal access
    return NextResponse.next()
  }

  if (pathname === '/favicon.ico') {
    return rewriteTo(`/public/icons/${subdomain}.ico`)
  }

  // For the root path on a subdomain, rewrite to the subdomain page
  const subdomainPath = (pathname === '/' ? '' : pathname) + search
  const response = rewriteTo(`/s/${subdomain + subdomainPath}`)

  const route = routesConfig.find((r) =>
    typeof r.subdomain === 'string' ?
      r.subdomain === subdomain
    : r.subdomain.some((d) => d === subdomain),
  )
  if (!route?.publicPaths) return response

  const isPublicPath = route.publicPaths.some((path) => path === pathname)
  if (isPublicPath || route.authRedirectPath === pathname) return response

  const supabase = getSupabaseMiddleware(request, response)
  const { data, error } = await supabase.auth.getClaims()
  const isAuthenticated = Boolean(!error && data?.claims)
  if (isAuthenticated) return response

  const redirectPath =
    route.authRedirectPath + (subdomainPath && `?continue=${encodeURIComponent(subdomainPath)}`)
  return NextResponse.redirect(new URL(redirectPath, request.url))
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
