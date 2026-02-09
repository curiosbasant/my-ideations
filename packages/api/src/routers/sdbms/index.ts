import { authUserPersonId, eq, schema } from '@my/db'

import { protectedProcedure, publicProcedure } from '../../trpc'
import { classRouter } from './class'
import { studentRouter } from './student'
import { teacherRouter } from './teacher'

export const sdbmsRouter = {
  admin: {
    check: protectedProcedure.query(
      ({ ctx }) => ctx.authUserId === process.env['SUPABASE_ADMIN_USER_ID'],
    ),
  },
  class: classRouter,
  exam: {
    list: publicProcedure.query(({ ctx: { rls } }) => {
      return rls((tx) => tx.select().from(schema.sd__luExam))
    }),
  },
  institute: {
    list: publicProcedure.query(({ ctx: { rls } }) => {
      return rls((tx) =>
        tx
          .select({
            id: schema.sd__institute.id,
            name: schema.sd__institute.name,
          })
          .from(schema.sd__institute),
      )
    }),
  },
  session: {
    list: publicProcedure.query(({ ctx: { rls } }) => {
      return rls((tx) => tx.select().from(schema.sd__luSession))
    }),
  },
  student: studentRouter,
  subject: {
    list: publicProcedure.query(({ ctx: { rls } }) => {
      return rls((tx) => tx.select().from(schema.sd__luSubject))
    }),
  },
  teacher: teacherRouter,
  user: {
    role: protectedProcedure.query(async ({ ctx: { rls } }) => {
      return rls(async (tx) => {
        const [[teacherExists], [studentExists]] = await Promise.all([
          tx
            .select({ id: schema.sd__teacher.id })
            .from(schema.sd__teacher)
            .where(eq(schema.sd__teacher.personId, authUserPersonId)),
          tx
            .select({ id: schema.sd__student.id })
            .from(schema.sd__student)
            .where(eq(schema.sd__student.personId, authUserPersonId)),
        ])
        if (teacherExists) return 'teacher'
        if (studentExists) return 'student'
        return null
      })
    }),
  },
}
