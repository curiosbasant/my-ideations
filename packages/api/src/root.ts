import { authRouter } from './routers/auth'
import { createRouter } from './trpc'

export const appRouter = createRouter({
  auth: authRouter,
})
