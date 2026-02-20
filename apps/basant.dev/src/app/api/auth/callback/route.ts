import { NextResponse, type NextRequest } from 'next/server'

import { getSupabase } from '~/lib/supabase'

/**
 * This is mainly being used for OAuth PKSE authentication flow.
 */
export async function GET(req: NextRequest) {
  const subdomainOrigin = `${req.nextUrl.protocol}//${req.headers.get('host')}`
  const code = req.nextUrl.searchParams.get('code')

  if (code) {
    const supabase = await getSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const url = new URL('/login', subdomainOrigin)
      url.searchParams.set('error', error.message)
      return NextResponse.redirect(url)
    }
  }

  const next = req.nextUrl.searchParams.get('next')
  const url = new URL(next || '/', subdomainOrigin)

  return NextResponse.redirect(url)
}
