import { authRouter } from './routers/auth'
import { dotsAndBoxesRouter } from './routers/dots-and-boxes'
import { personRouter } from './routers/person'
import { priyasthanRouter } from './routers/priyasthan'
import { sdbmsRouter } from './routers/sdbms'
import { spendBuddyRouter } from './routers/spend-buddy'
import { userRouter } from './routers/user'
import { createRouter } from './trpc'

export const appRouter = createRouter({
  auth: authRouter,
  dotsAndBoxes: dotsAndBoxesRouter,
  person: personRouter,
  priyasthan: priyasthanRouter,
  sdbms: sdbmsRouter,
  spendBuddy: spendBuddyRouter,
  user: userRouter,
})
