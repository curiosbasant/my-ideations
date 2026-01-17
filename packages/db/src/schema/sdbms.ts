import { index, pgTableCreator, uniqueIndex } from 'drizzle-orm/pg-core'

import { id, smallId, withCommonColumns } from '../utils/pg-column-helpers'
import { address } from './address'
import { person } from './person'

const pgTable = pgTableCreator((tableName) => `sd__${tableName}`)

export const sd__session = pgTable('session', (c) => ({
  id: smallId.primaryKey(),
  name: c.varchar().unique().notNull(),
}))

export const sd__institute = pgTable(
  'institute',
  withCommonColumns((c) => ({
    name: c.varchar().notNull(),
    addressId: id.references(() => address.id),
  })),
  (t) => [index().on(t.createdAt.desc())],
)

export const sd__teacher = pgTable(
  'teacher',
  withCommonColumns(() => ({
    personId: id.references(() => person.id).notNull(),
    instituteId: id.references(() => sd__institute.id).notNull(),
  })),
  (t) => [uniqueIndex().on(t.personId), index().on(t.instituteId), index().on(t.createdAt.desc())],
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
  (t) => [index().on(t.createdAt.desc()), uniqueIndex().on(t.instituteId, t.admissionNo)],
)

export const sd__class = pgTable(
  'class',
  (c) => ({
    id: smallId.primaryKey(),
    instituteId: id.references(() => sd__institute.id).notNull(),
    numeral: smallId().notNull(),
    name: c.varchar().notNull(),
    stream: id.references(() => sd__classStream.id),
  }),
  (t) => [uniqueIndex().on(t.instituteId, t.numeral)],
)

export const sd__classSection = pgTable(
  'class_section',
  (c) => ({
    id: smallId.primaryKey(),
    classId: smallId.references(() => sd__class.id).notNull(),
    name: c.varchar().notNull(),
  }),
  (t) => [uniqueIndex().on(t.classId, t.name)],
)

export const sd__classStudent = pgTable(
  'class_student',
  (c) => ({
    id: id.primaryKey(),
    sessionId: smallId.references(() => sd__session.id).notNull(),
    instituteId: id.references(() => sd__institute.id).notNull(),
    classId: smallId.references(() => sd__class.id).notNull(),
    sectionId: smallId.references(() => sd__classSection.id).notNull(),
    studentId: id.references(() => sd__student.id).notNull(),
    rollNo: c.smallint(),
  }),
  (t) => [uniqueIndex().on(t.sessionId, t.instituteId, t.classId, t.sectionId, t.studentId)],
)

// ~~~~~~ Lookup Tables ~~~~~~

export const sd__classStream = pgTable('class_stream', (c) => ({
  id: smallId.primaryKey(),
  name: c.varchar().unique().notNull(),
}))
