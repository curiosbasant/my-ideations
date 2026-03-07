import { index, pgPolicy, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core'
import { eq, exists } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

import { policyAllowAnyoneSelect, policyAllowAuthenticatedSelect } from '../../utils/helpers/policy'
import {
  bigId,
  CASCADE_ON_UPDATE,
  getTimestampColumns,
  smallId,
  withCommonColumns,
} from '../../utils/pg-column-helpers'
import { qb } from '../../utils/qb'
import { person } from '../person'
import { pgTable } from './_helpers'
import { sd__institute } from './institute'
import {
  policyAllowTeacherInsertOwn,
  policyAllowTeacherSelectOwn,
  policyAllowTeacherUpdateOwn,
  sd__teacher,
} from './teacher'

export { sd__institute, sd__teacher }

export const sd__teacherSubject = pgTable(
  'teacher_subject',
  () => {
    const { createdAt, updatedAt: deletedAt } = getTimestampColumns()
    return {
      sessionId: smallId.references(() => sd__luSession.id, CASCADE_ON_UPDATE).notNull(),
      teacherId: bigId.references(() => sd__teacher.id).notNull(),
      classSectionId: smallId.references(() => sd__classSection.id).notNull(),
      subjectId: smallId.references(() => sd__luSubject.id).notNull(),
      createdAt,
      deletedAt,
    }
  },
  (t) => [
    primaryKey({ columns: [t.sessionId, t.teacherId, t.classSectionId, t.subjectId] }),
    policyAllowTeacherSelectOwn(t.teacherId),
    policyAllowTeacherInsertOwn(t.teacherId),
    policyAllowTeacherUpdateOwn(t.teacherId),
  ],
)

export const sd__student = pgTable(
  'student',
  withCommonColumns((c) => ({
    personId: bigId.references(() => person.id).notNull(),
    instituteId: bigId.references(() => sd__institute.id).notNull(),
    admissionNo: c.varchar(),
    admissionDate: c.date(),
    distanceKm: c.smallint(),
    status: smallId.references(() => sd__luStudentStatus.id, CASCADE_ON_UPDATE),
  })),
  (t) => [
    index().on(t.createdAt.desc()),
    uniqueIndex().on(t.instituteId, t.admissionNo),
    policyAllowAuthenticatedSelect,
  ],
)

export const sd__class = pgTable(
  'class',
  (c) => ({
    id: smallId.primaryKey(),
    instituteId: bigId.references(() => sd__institute.id).notNull(),
    numeral: c.smallint().notNull(),
    name: c.varchar().notNull(),
    stream: smallId.references(() => sd__luStream.id, CASCADE_ON_UPDATE),
    ...getTimestampColumns(),
  }),
  (t) => [uniqueIndex().on(t.instituteId, t.numeral), policyAllowAnyoneSelect],
)

export const sd__classSection = pgTable(
  'class_section',
  (c) => ({
    id: smallId.primaryKey(),
    classId: smallId.references(() => sd__class.id).notNull(),
    name: c.varchar().notNull(),
    ...getTimestampColumns(),
  }),
  (t) => [uniqueIndex().on(t.classId, t.name), policyAllowAnyoneSelect],
)

export const sd__classStudent = pgTable(
  'class_student',
  (c) => ({
    id: bigId.primaryKey(),
    sessionId: smallId.references(() => sd__luSession.id, CASCADE_ON_UPDATE).notNull(),
    instituteId: bigId.references(() => sd__institute.id).notNull(),
    classId: smallId.references(() => sd__class.id).notNull(),
    sectionId: smallId.references(() => sd__classSection.id).notNull(),
    studentId: bigId.references(() => sd__student.id).notNull(),
    rollNo: c.smallint(),
    ...getTimestampColumns(),
  }),
  (t) => [
    uniqueIndex().on(t.sessionId, t.instituteId, t.classId, t.sectionId, t.studentId),
    policyAllowAuthenticatedSelect,
  ],
)

export const sd__classStudentMarks = pgTable(
  'class_student_mark',
  withCommonColumns((c) => ({
    exam: smallId.references(() => sd__luExam.id, CASCADE_ON_UPDATE).notNull(),
    subject: smallId.references(() => sd__luSubject.id, CASCADE_ON_UPDATE).notNull(),
    classStudentId: bigId.references(() => sd__classStudent.id).notNull(),
    mark: c.smallint(),
  })),
  (t) => {
    const isTeacher = exists(
      qb.select().from(sd__teacher).where(eq(sd__teacher.createdBy, t.createdBy)),
    )
    return [
      uniqueIndex().on(t.exam, t.subject, t.classStudentId),
      policyAllowAuthenticatedSelect,
      pgPolicy('allow_teacher_insert', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: isTeacher,
      }),
      pgPolicy('allow_teacher_update', {
        for: 'update',
        to: authenticatedRole,
        using: isTeacher,
      }),
    ]
  },
)

// ~~~~~~ Lookup Tables ~~~~~~

export const sd__luExam = pgTable(
  'lu_exam',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)

export const sd__luSession = pgTable(
  'lu_session',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)

export const sd__luStudentStatus = pgTable(
  'lu_student_status',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)

export const sd__luStream = pgTable(
  'lu_stream',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)

export const sd__luSubject = pgTable(
  'lu_subject',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)
