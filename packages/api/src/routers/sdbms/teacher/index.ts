import { and, authUid, authUserPersonId, caseWhen, eq, isNull, now, schema } from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../../../trpc'
import { importFileProcedure } from './import-file'

export const teacherRouter = {
  connectProfile: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        dob: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { rls } }) => {
      return rls(async (tx) => {
        await tx
          .update(schema.profile)
          .set({ personId: schema.person.id })
          .from(schema.person)
          .innerJoin(schema.sd__teacher, eq(schema.person.id, schema.sd__teacher.personId))
          .where(
            and(
              eq(schema.person.dob, input.dob),
              eq(schema.sd__teacher.employeeId, input.employeeId),
              eq(schema.profile.createdBy, authUid),
            ),
          )
      })
    }),
  importFile: importFileProcedure,
  subject: {
    list: protectedProcedure
      .input(
        z.object({
          sessionId: z.number(),
        }),
      )
      .query(async ({ input, ctx: { rls } }) => {
        return rls(async (tx) => {
          return tx
            .select({
              classId: schema.sd__class.id,
              sectionId: schema.sd__classSection.id,
              subjectId: schema.sd__luSubject.id,
              className: schema.sd__class.name,
              sectionName: schema.sd__classSection.name,
              subjectName: schema.sd__luSubject.name,
            })
            .from(schema.sd__teacherSubject)
            .innerJoin(
              schema.sd__teacher,
              eq(schema.sd__teacherSubject.teacherId, schema.sd__teacher.id),
            )
            .innerJoin(
              schema.sd__classSection,
              eq(schema.sd__teacherSubject.classSectionId, schema.sd__classSection.id),
            )
            .innerJoin(schema.sd__class, eq(schema.sd__classSection.classId, schema.sd__class.id))
            .innerJoin(
              schema.sd__luSubject,
              eq(schema.sd__teacherSubject.subjectId, schema.sd__luSubject.id),
            )
            .where(
              and(
                isNull(schema.sd__teacherSubject.deletedAt),
                eq(schema.sd__teacherSubject.sessionId, input.sessionId),
                eq(schema.sd__teacher.personId, authUserPersonId),
              ),
            )
            .orderBy(schema.sd__class.id)
        })
      }),
    toggle: protectedProcedure
      .input(
        z.object({
          sessionId: z.number(),
          sectionId: z.number(),
          subjectId: z.number(),
        }),
      )
      .mutation(async ({ input, ctx: { rls } }) => {
        return rls(async (tx) => {
          const [row] = await tx
            .select({ id: schema.sd__teacher.id })
            .from(schema.sd__teacher)
            .where(eq(schema.sd__teacher.personId, authUserPersonId))

          await tx
            .insert(schema.sd__teacherSubject)
            .values({
              sessionId: input.sessionId,
              teacherId: row.id,
              classSectionId: input.sectionId,
              subjectId: input.subjectId,
            })
            .onConflictDoUpdate({
              target: [
                schema.sd__teacherSubject.sessionId,
                schema.sd__teacherSubject.teacherId,
                schema.sd__teacherSubject.classSectionId,
                schema.sd__teacherSubject.subjectId,
              ],
              set: {
                deletedAt: caseWhen(isNull(schema.sd__teacherSubject.deletedAt), now()).elseNull(),
              },
            })
        })
      }),
  },
}
