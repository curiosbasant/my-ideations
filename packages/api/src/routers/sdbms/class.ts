import {
  and,
  authUserPersonId,
  eq,
  now,
  personFullName,
  schema,
  sql,
  type DbTransaction,
} from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../../trpc'

export const classRouter = {
  list: protectedProcedure.query(({ ctx: { rls } }) => {
    return rls((tx) => {
      return tx
        .select({
          id: schema.sd__class.id,
          numeral: schema.sd__class.numeral,
          name: schema.sd__class.name,
        })
        .from(schema.sd__class)
        .innerJoin(
          schema.sd__teacher,
          eq(schema.sd__class.instituteId, schema.sd__teacher.instituteId),
        )
        .where(eq(schema.sd__teacher.personId, authUserPersonId))
    })
  }),
  student: {
    mark: {
      list: protectedProcedure
        .input(
          z.object({
            sessionId: z.number(),
            exam: z.number(),
            standard: z.number(),
            subject: z.number(),
          }),
        )
        .query(async ({ input, ctx: { rls } }) => {
          return rls(async (tx) => {
            const withStudentProfile = getStudentProfileCte(tx)

            const students = await tx
              .with(withStudentProfile)
              .select({
                id: withStudentProfile.studentId,
                admissionNo: withStudentProfile.studentAdmissionNo,
                fullName: withStudentProfile.fullName,
                class: {
                  id: withStudentProfile.classId,
                  standard: withStudentProfile.numeral,
                  studentId: withStudentProfile.classStudentId,
                },
                section: {
                  id: withStudentProfile.sectionId,
                  name: withStudentProfile.sectionName,
                },
                fName: withStudentProfile.fName,
                mark: schema.sd__classStudentMarks.mark,
              })
              .from(withStudentProfile)
              .innerJoin(
                schema.sd__teacher,
                eq(schema.sd__teacher.instituteId, withStudentProfile.instituteId),
              )
              .leftJoin(
                schema.sd__classStudentMarks,
                and(
                  eq(
                    schema.sd__classStudentMarks.classStudentId,
                    withStudentProfile.classStudentId,
                  ),
                  eq(schema.sd__classStudentMarks.exam, input.exam),
                  eq(schema.sd__classStudentMarks.subject, input.subject),
                ),
              )
              .where(
                and(
                  eq(schema.sd__teacher.personId, authUserPersonId),
                  eq(withStudentProfile.sessionId, input.sessionId),
                  eq(withStudentProfile.numeral, input.standard),
                  eq(withStudentProfile.sectionName, 'A'),
                ),
              )

            return students
          })
        }),
      set: protectedProcedure
        .input(
          z.object({
            exam: z.number(),
            classStudentId: z.number(),
            subject: z.number(),
            mark: z.number(),
          }),
        )
        .query(async ({ input, ctx: { rls } }) => {
          return rls(async (tx) => {
            return tx
              .insert(schema.sd__classStudentMarks)
              .values({
                exam: input.exam,
                subject: input.subject,
                classStudentId: input.classStudentId,
                mark: input.mark,
              })
              .onConflictDoUpdate({
                target: [
                  schema.sd__classStudentMarks.exam,
                  schema.sd__classStudentMarks.subject,
                  schema.sd__classStudentMarks.classStudentId,
                ],
                set: {
                  mark: input.mark,
                  updatedAt: now(),
                },
              })
          })
        }),
    },
  },
}

function getStudentProfileCte(tx: DbTransaction) {
  const withRelativeFather = tx.$with('with_relative_father').as((qb) =>
    qb
      .select({
        id: schema.person.id,
        studentPersonId: schema.personRelation.personId,
        fullName: personFullName().as('father_name'),
      })
      .from(schema.personRelation)
      .innerJoin(schema.person, eq(schema.person.id, schema.personRelation.relativeId))
      .where(eq(schema.personRelation.relation, 1)),
  )
  return tx.$with('with_student_profile').as((qb) =>
    qb
      .with(withRelativeFather)
      .select({
        classStudentId: schema.sd__classStudent.id,
        sessionId: schema.sd__classStudent.sessionId,
        instituteId: schema.sd__classStudent.instituteId,
        classId: schema.sd__classStudent.classId,
        numeral: schema.sd__class.numeral,
        sectionId: schema.sd__classStudent.sectionId,
        sectionName: sql`${schema.sd__classSection.name}`.as('section_name'),
        studentId: schema.sd__classStudent.studentId,
        studentAdmissionNo: schema.sd__student.admissionNo,
        fullName: personFullName().as('full_name'),
        fName: withRelativeFather.fullName,
      })
      .from(schema.sd__classStudent)
      .innerJoin(schema.sd__class, eq(schema.sd__class.id, schema.sd__classStudent.classId))
      .innerJoin(
        schema.sd__classSection,
        eq(schema.sd__classSection.id, schema.sd__classStudent.sectionId),
      )
      .innerJoin(schema.sd__student, eq(schema.sd__student.id, schema.sd__classStudent.studentId))
      .innerJoin(schema.person, eq(schema.person.id, schema.sd__student.personId))
      .leftJoin(withRelativeFather, eq(withRelativeFather.studentPersonId, schema.person.id)),
  )
}
