import { eq, or, sql } from 'drizzle-orm'
import { check, index, pgPolicy, primaryKey } from 'drizzle-orm/pg-core'
import { authenticatedRole } from 'drizzle-orm/supabase'

import { authUserPersonId } from '../utils/fn-helpers'
import {
  CASCADE_ON_UPDATE,
  getTimestampColumns,
  id,
  smallId,
} from '../utils/pg-column-helpers/helpers'
import { length } from '../utils/pg-functions'
import {
  pgTable,
  policyAllowAuthenticatedInsert,
  policyAllowAuthenticatedSelect,
  policyAllowPublicSelect,
} from '../utils/pg-table-helpers'
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
    bloodGroup: c.varchar(),
    ...getTimestampColumns(),
  }),
  (t) => [
    index().on(t.createdAt.desc()),
    check('enforce_contact_length', eq(length(t.contactNo), sql.raw('10'))),
    policyAllowAuthenticatedSelect,
    policyAllowAuthenticatedInsert,
    pgPolicy('Allow update to person', {
      for: 'update',
      to: authenticatedRole,
      using: eq(t.id, authUserPersonId),
    }),
  ],
)

export const personRelation = pgTable(
  'person_relation',
  () => ({
    personId: id.references(() => person.id).notNull(),
    relativeId: id.references(() => person.id).notNull(),
    relation: smallId.references(() => personRelationType.id, CASCADE_ON_UPDATE).notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.personId, t.relativeId] }),
    pgPolicy('Allow select to person or relative', {
      for: 'select',
      to: authenticatedRole,
      using: or(eq(t.personId, authUserPersonId), eq(t.relativeId, authUserPersonId)),
    }),
    pgPolicy('Allow insert to person', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: eq(t.personId, authUserPersonId),
    }),
    pgPolicy('Allow update to person or relative', {
      for: 'update',
      to: authenticatedRole,
      using: or(eq(t.personId, authUserPersonId), eq(t.relativeId, authUserPersonId)),
    }),
  ],
)

// ~~~~~~ Lookup Tables ~~~~~~

export const personCategory = pgTable(
  'person_lu_category',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowPublicSelect],
)

export const personGender = pgTable(
  'person_lu_gender',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowPublicSelect],
)

export const personRelationType = pgTable(
  'person_lu_relation_type',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowPublicSelect],
)

export const personReligion = pgTable(
  'person_lu_religion',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowPublicSelect],
)
