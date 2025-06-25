import { NextResponse, type NextRequest } from 'next/server'

import { getPublicUrlFromShortcode } from '../server'

export async function GET(_: NextRequest, ctx: { params: Promise<{ shortcode: string }> }) {
  const { shortcode } = await ctx.params

  try {
    const publicUrl = await getPublicUrlFromShortcode(shortcode)
    // NOTE: Currently rewrite is not supported, so we have to use ugly redirect for this.
    return NextResponse.redirect(publicUrl)
  } catch {
    return new Response('Resource not found', { status: 404 })
  }
}
