import { authUid, authUserPersonId, eq, schema } from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure, publicProcedure } from '../../trpc'
import { classRouter } from './class'
import { studentRouter } from './student'

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
  teacher: {
    create: publicProcedure
      .input(
        z.object({
          instituteId: z.number(),
          firstName: z.string(),
          lastName: z.string().nullable(),
          gender: z.number(),
        }),
      )
      .mutation(async ({ input, ctx: { rls } }) => {
        return rls(async (tx) => {
          const [person] = await tx
            .insert(schema.person)
            .values({ firstName: input.firstName, lastName: input.lastName, gender: input.gender })
            .returning({ id: schema.person.id })
          const [[teacher]] = await Promise.all([
            tx
              .insert(schema.sd__teacher)
              .values({ personId: person.id, instituteId: input.instituteId })
              .returning({ id: schema.sd__teacher.id }),
            tx
              .update(schema.profile)
              .set({ personId: person.id })
              .where(eq(schema.profile.createdBy, authUid)),
          ])
          return teacher.id
        })
      }),
  },
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
