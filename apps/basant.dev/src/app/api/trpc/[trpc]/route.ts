import { appRouter, createTRPCContext, fetchRequestHandler } from '@my/api'
import { createOrigin } from '@my/lib/utils'

import { getSupabase } from '~/lib/supabase'

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response, origin: string) => {
  if ([createOrigin('sdbms')].includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin)
  }
  res.headers.set('Access-Control-Allow-Credentials', 'true')
  // CORS specification does not allow the use of * for headers or methods when Access-Control-Allow-Credentials is set to true.
  res.headers.set('Access-Control-Allow-Headers', 'x-trpc-source')
  res.headers.set('Access-Control-Allow-Methods', 'OPTIONS,GET,POST')
  res.headers.set('Access-Control-Request-Method', '*')
  res.headers.set('Referrer-Policy', 'no-referrer')
}

export function OPTIONS(req: Request) {
  const response = new Response(null, { status: 204 })
  setCorsHeaders(response, req.headers.get('origin') || '')
  return response
}

async function handler(req: Request) {
  const supabase = await getSupabase()
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers, supabase }),
  })

  setCorsHeaders(response, req.headers.get('origin') || '')
  return response
}

export { handler as GET, handler as POST }
