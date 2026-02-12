import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { appRouter } from './root'
import { createCallerFactory } from './trpc'

export { fetchRequestHandler } from '@trpc/server/adapters/fetch'
export { createTRPCContext } from './trpc'

export const createCaller = createCallerFactory(appRouter)

export { appRouter }
export type AppRouter = typeof appRouter

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>
