import { NextResponse, type NextRequest } from 'next/server'

import { getSupabase } from '~/lib/supabase'
import { extractSubdomain } from '~/lib/utils/domain'

/**
 * This is mainly being used for OAuth PKSE authentication flow.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const subdomain = extractSubdomain(req)

  if (code) {
    const supabase = await getSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(req.nextUrl.origin + '/login?error=' + error.message)
    }
  }

  const next = req.nextUrl.searchParams.get('next')
  const url = new URL(next || '/', req.url)
  if (subdomain && !url.hostname.startsWith(subdomain)) {
    url.hostname = subdomain + '.' + url.hostname
  }

  return NextResponse.redirect(url)
}
