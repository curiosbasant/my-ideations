import { protectedProcedure } from '../../trpc'

export const adminRouter = {
  check: protectedProcedure.query(
    ({ ctx }) => ctx.authUserId === process.env['SUPABASE_ADMIN_USER_ID'],
  ),
}
