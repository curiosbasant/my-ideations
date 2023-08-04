import { NextMiddleware, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

import { Database } from '~/lib/supabase'

export const middleware: NextMiddleware = async (req) => {
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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
