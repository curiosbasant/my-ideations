import { authRouter } from './routers/auth'
import { spendBuddyRouter } from './routers/spend-buddy'
import { createRouter } from './trpc'

export const appRouter = createRouter({
  auth: authRouter,
  spendBuddy: spendBuddyRouter,
})
