import { authRouter } from './routers/auth'
import { dotsAndBoxesRouter } from './routers/dots-and-boxes'
import { feedbackRouter } from './routers/feedback'
import { personRouter } from './routers/person'
import { priyasthanRouter } from './routers/priyasthan'
import { sdbmsRouter } from './routers/sdbms'
import { snapfileRouter } from './routers/snapfile'
import { spendBuddyRouter } from './routers/spend-buddy'
import { userRouter } from './routers/user'
import { createRouter } from './trpc'

export const appRouter = createRouter({
  auth: authRouter,
  dotsAndBoxes: dotsAndBoxesRouter,
  feedback: feedbackRouter,
  person: personRouter,
  priyasthan: priyasthanRouter,
  sdbms: sdbmsRouter,
  snapfile: snapfileRouter,
  spendBuddy: spendBuddyRouter,
  user: userRouter,
})
