/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from '@trpc/server'

import { db } from '@my/db'
import { withThrowOnError, type SupabaseClient } from '@my/lib/supabase'
import { SuperJSON } from '@my/lib/superjson'
import { z, ZodError } from '@my/lib/zod'

import { rlsCreator } from './lib/rls'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export async function createTRPCContext(opts: { headers: Headers; supabase: SupabaseClient }) {
  const { data } = await opts.supabase.auth.getClaims()
  const rls = rlsCreator(db, data?.claims)

  const source = opts.headers.get('x-trpc-source') ?? 'unknown'
  console.log('>>> tRPC Request from', source, 'by', data?.claims.sub || 'someone')

  return {
    ...opts,
    origin: opts.headers.get('origin'),
    db,
    rls,
    claims: data?.claims,
  }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
      },
    }
  },
})

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createRouter = t.router

/**
 * Public procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure

/**
 * Procedure protected to authenticated users
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.claims) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      authUserId: ctx.claims.sub,
      claims: ctx.claims,
    },
  })
})

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.authUserId !== process.env['SUPABASE_ADMIN_USER_ID']) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const rls = rlsCreator(db, ctx.claims, true)

  return next({
    ctx: {
      rls,
    },
  })
})

export const anonymousProcedure = t.procedure
  .input(z.object({ fullName: z.string() }))
  .use(async ({ ctx, input, next }) => {
    if (!ctx.claims) {
      if (!input.fullName) throw new TRPCError({ code: 'FORBIDDEN' })
      const metadata = { full_name: input.fullName }
      const data = await withThrowOnError(
        ctx.supabase.auth.signInAnonymously({ options: { data: metadata } }),
      )

      if (!data.session) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

      return next({
        ctx: {
          session: data.session,
          authUserId: data.session.user.id,
        },
      })
    }

    return next({
      ctx: {
        authUserId: ctx.claims.sub,
      },
    })
  })
