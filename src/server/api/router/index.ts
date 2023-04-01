import { router } from '../trpc'
import dotsAndBoxesRouter from './dotsAndBoxes'
import exampleRouter from './example'

export const appRouter = router({
  example: exampleRouter,
  dotsAndBoxes: dotsAndBoxesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
