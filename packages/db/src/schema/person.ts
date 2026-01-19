import { eq, sql } from 'drizzle-orm'
import { check, index, primaryKey } from 'drizzle-orm/pg-core'

import {
  CASCADE_ON_UPDATE,
  getTimestampColumns,
  id,
  smallId,
} from '../utils/pg-column-helpers/helpers'
import { length } from '../utils/pg-functions'
import { pgTable } from '../utils/pg-table-helpers'
import { address } from './address'

export const person = pgTable(
  'person',
  (c) => ({
    id: id.primaryKey(),
    firstName: c.varchar().notNull(),
    lastName: c.varchar(),
    dob: c.date(),
    category: smallId.references(() => personCategory.id, CASCADE_ON_UPDATE),
    gender: smallId.references(() => personGender.id, CASCADE_ON_UPDATE).notNull(),
    religion: smallId.references(() => personReligion.id, CASCADE_ON_UPDATE),
    contactNo: c.varchar(),
    minority: c.boolean(),
    bpl: c.boolean(),
    addressId: id.references(() => address.id),
    ...getTimestampColumns(),
  }),
  (t) => [
    index().on(t.createdAt.desc()),
    check('enforce_contact_length', eq(length(t.contactNo), sql.raw('10'))),
  ],
)

export const personRelation = pgTable(
  'person_relation',
  () => ({
    personId: id.references(() => person.id).notNull(),
    relativeId: id.references(() => person.id).notNull(),
    relation: smallId.references(() => personRelationType.id, CASCADE_ON_UPDATE).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.personId, t.relativeId] })],
)

export const personDocument = pgTable(
  'person_document',
  (c) => ({
    personId: id.references(() => person.id).notNull(),
    type: smallId.references(() => personDocumentType.id, CASCADE_ON_UPDATE).notNull(),
    number: c.text(),
    documentUrl: c.text().notNull(),
  }),
  (t) => [primaryKey({ columns: [t.personId, t.type] })],
)

// ~~~~~~ Lookup Tables ~~~~~~

export const personCategory = pgTable('person_lu_category', (c) => ({
  id: smallId().primaryKey(),
  name: c.varchar().unique().notNull(),
}))

export const personDocumentType = pgTable('person_lu_document_type', (c) => ({
  id: smallId().primaryKey(),
  name: c.varchar().unique().notNull(),
}))

export const personGender = pgTable('person_lu_gender', (c) => ({
  id: smallId().primaryKey(),
  name: c.varchar().unique().notNull(),
}))

export const personRelationType = pgTable('person_lu_relation_type', (c) => ({
  id: smallId().primaryKey(),
  name: c.varchar().unique().notNull(),
}))

export const personReligion = pgTable('person_lu_religion', (c) => ({
  id: smallId().primaryKey(),
  name: c.varchar().unique().notNull(),
}))
