import { router } from '../trpc'
import exampleRouter from './example'
import dotsAndBoxesRouter from './dotsAndBoxes'

export const appRouter = router({
  example: exampleRouter,
  dotsAndBoxes: dotsAndBoxesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
