import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

import { type Context } from './context'

const trpc = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

export default trpc
export const router = trpc.router

export const publicProcedure = trpc.procedure
