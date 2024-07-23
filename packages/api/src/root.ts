import { authRouter } from './routers/auth'
import { dotsAndBoxesRouter } from './routers/dots-and-boxes'
import { spendBuddyRouter } from './routers/spend-buddy'
import { userRouter } from './routers/user'
import { createRouter } from './trpc'

export const appRouter = createRouter({
  auth: authRouter,
  dotsAndBoxes: dotsAndBoxesRouter,
  spendBuddy: spendBuddyRouter,
  user: userRouter,
})
