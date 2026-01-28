import { and, eq, exists, sql } from 'drizzle-orm'
import { index, pgPolicy, pgTableCreator, uniqueIndex } from 'drizzle-orm/pg-core'

import { authUserProfileId } from '../utils/fn-helpers'
import { CASCADE_ON_UPDATE, id, smallId, withCommonColumns } from '../utils/pg-column-helpers'
import { insertOnlyPolicy, selectOnlyPolicy } from '../utils/pg-table-helpers'
import { qb } from '../utils/qb'
import { address } from './address'
import { person } from './person'

const pgTable = pgTableCreator((tableName) => `sd__${tableName}`)

export const sd__institute = pgTable(
  'institute',
  withCommonColumns((c) => ({
    name: c.varchar().notNull(),
    addressId: id.references(() => address.id),
  })),
  (t) => [selectOnlyPolicy, index().on(t.createdAt.desc())],
)

export const sd__teacher = pgTable(
  'teacher',
  withCommonColumns(() => ({
    personId: id.references(() => person.id).notNull(),
    instituteId: id.references(() => sd__institute.id).notNull(),
  })),
  (t) => [
    selectOnlyPolicy,
    insertOnlyPolicy,
    uniqueIndex().on(t.personId),
    index().on(t.instituteId),
    index().on(t.createdAt.desc()),
  ],
)

export const sd__student = pgTable(
  'student',
  withCommonColumns((c) => ({
    personId: id.references(() => person.id).notNull(),
    instituteId: id.references(() => sd__institute.id).notNull(),
    admissionNo: c.varchar(),
    admissionDate: c.date(),
    distanceKm: c.smallint(),
  })),
  (t) => [
    selectOnlyPolicy,
    index().on(t.createdAt.desc()),
    uniqueIndex().on(t.instituteId, t.admissionNo),
  ],
)

export const sd__class = pgTable(
  'class',
  (c) => ({
    id: smallId.primaryKey(),
    instituteId: id.references(() => sd__institute.id).notNull(),
    numeral: smallId().notNull(),
    name: c.varchar().notNull(),
    stream: id.references(() => sd__luStream.id, CASCADE_ON_UPDATE),
  }),
  (t) => [selectOnlyPolicy, uniqueIndex().on(t.instituteId, t.numeral)],
)

export const sd__classSection = pgTable(
  'class_section',
  (c) => ({
    id: smallId.primaryKey(),
    classId: smallId.references(() => sd__class.id).notNull(),
    name: c.varchar().notNull(),
  }),
  (t) => [selectOnlyPolicy, uniqueIndex().on(t.classId, t.name)],
)

export const sd__classStudent = pgTable(
  'class_student',
  (c) => ({
    id: id.primaryKey(),
    sessionId: smallId.references(() => sd__luSession.id, CASCADE_ON_UPDATE).notNull(),
    instituteId: id.references(() => sd__institute.id).notNull(),
    classId: smallId.references(() => sd__class.id).notNull(),
    sectionId: smallId.references(() => sd__classSection.id).notNull(),
    studentId: id.references(() => sd__student.id).notNull(),
    rollNo: c.smallint(),
  }),
  (t) => [
    selectOnlyPolicy,
    uniqueIndex().on(t.sessionId, t.instituteId, t.classId, t.sectionId, t.studentId),
  ],
)

export const sd__classStudentMarks = pgTable(
  'class_student_mark',
  withCommonColumns((c) => ({
    exam: smallId.references(() => sd__luExam.id, CASCADE_ON_UPDATE).notNull(),
    subject: smallId.references(() => sd__luSubject.id, CASCADE_ON_UPDATE).notNull(),
    classStudentId: smallId.references(() => sd__classStudent.id).notNull(),
    mark: c.smallint(),
  })),
  (t) => [
    selectOnlyPolicy,
    pgPolicy('allow_insert_to_teachers', {
      for: 'insert',
      withCheck: and(
        eq(t.createdBy, authUserProfileId),
        exists(
          qb
            .select({ success: sql<number>`1` })
            .from(sd__teacher)
            .where(eq(sd__teacher.createdBy, t.createdBy)),
        ),
      ),
    }),
    uniqueIndex().on(t.exam, t.subject, t.classStudentId),
  ],
)

// ~~~~~~ Lookup Tables ~~~~~~

export const sd__luExam = pgTable(
  'lu_exam',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [selectOnlyPolicy],
)

export const sd__luSession = pgTable(
  'lu_session',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [selectOnlyPolicy],
)

export const sd__luStream = pgTable(
  'lu_stream',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [selectOnlyPolicy],
)

export const sd__luSubject = pgTable(
  'lu_subject',
  (c) => ({
    id: smallId.primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [selectOnlyPolicy],
)
