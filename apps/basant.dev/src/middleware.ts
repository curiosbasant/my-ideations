import { NextResponse, type NextRequest } from 'next/server'

import { ROOT_DOMAIN } from '~/lib/env'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const subdomain = extractSubdomain(request)

  if (subdomain) {
    if (pathname === '/favicon.ico') {
      return NextResponse.rewrite(new URL(`/icons/${subdomain}.ico`, request.url))
    }
    // For the root path on a subdomain, rewrite to the subdomain page
    return NextResponse.rewrite(
      new URL(`/s/${pathname === '/' ? subdomain : subdomain + pathname}${search}`, request.url),
    )
  }

  if (pathname.startsWith('/s/')) {
    const { subdomain, restPath } =
      pathname.match(/\/s\/(?<subdomain>[^\/]+)(?<restPath>.*)/)?.groups ?? {}
    return NextResponse.redirect(
      new URL(`${request.nextUrl.protocol}//${subdomain}.${ROOT_DOMAIN + restPath + search}`),
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

function extractSubdomain(request: NextRequest) {
  const url = request.url
  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0]

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/)
    if (fullUrlMatch?.[1]) {
      return fullUrlMatch[1]
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0]
    }

    return null
  }

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---')
    return parts.length > 0 ? parts[0] : null
  }

  // Production environment
  const rootDomainFormatted = ROOT_DOMAIN.split(':')[0]

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted
    && hostname !== `www.${rootDomainFormatted}`
    && hostname.endsWith(`.${rootDomainFormatted}`)

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null
}

/*
export const snapfileMiddleware: NextMiddleware = async (req) => {
  const probablyShortCode = req.nextUrl.pathname.split('/')[1]
  const supabase = createMiddlewareClient<Database>({ req, res: new NextResponse() })
  const { error, data: shortUrl } = await supabase
    .from('short_url')
    .select('url')
    .eq('code', probablyShortCode)
    .single()

  if (error) return NextResponse.next()

  return NextResponse.rewrite(shortUrl.url)
}
*/
