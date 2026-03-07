import { check, index, pgPolicy, primaryKey } from 'drizzle-orm/pg-core'
import { eq, sql } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

import { selectPersonId } from '../utils/helpers/db-functions'
import {
  policyAllowAnyoneSelect,
  policyAllowAuthenticatedInsert,
  policyAllowAuthenticatedSelect,
  policyAllowPersonInsertOwn,
  policyAllowPersonSelectOwn,
  policyAllowPersonUpdateOwn,
} from '../utils/helpers/policy'
import { length } from '../utils/helpers/sql'
import { pgTable } from '../utils/helpers/table'
import {
  bigId,
  CASCADE_ON_UPDATE,
  getTimestampColumns,
  smallId,
} from '../utils/pg-column-helpers/helpers'
import { address } from './address'

export const person = pgTable(
  'person',
  (c) => ({
    // Needs generatedByDefaultAsIdentity as to update on conflict target
    id: bigId().generatedByDefaultAsIdentity().primaryKey(),
    firstName: c.varchar().notNull(),
    lastName: c.varchar(),
    dob: c.date(),
    category: smallId.references(() => personCategory.id, CASCADE_ON_UPDATE),
    gender: smallId.references(() => personGender.id, CASCADE_ON_UPDATE).notNull(),
    religion: smallId.references(() => personReligion.id, CASCADE_ON_UPDATE),
    contactNo: c.varchar(),
    minority: c.boolean(),
    bpl: c.boolean(),
    addressId: bigId.references(() => address.id),
    bloodGroup: c.varchar(),
    ...getTimestampColumns(),
  }),
  (t) => [
    index().on(t.createdAt.desc()),
    check('enforce_contact_length', eq(length(t.contactNo), sql.raw('10'))),
    policyAllowAuthenticatedSelect,
    policyAllowAuthenticatedInsert,
    policyAllowPersonUpdateOwn(t.id),
  ],
)

export const personRelation = pgTable(
  'person_relation',
  () => ({
    personId: bigId.references(() => person.id).notNull(),
    relativeId: bigId.references(() => person.id).notNull(),
    relation: smallId.references(() => personRelationType.id, CASCADE_ON_UPDATE).notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.personId, t.relativeId] }),
    policyAllowPersonSelectOwn(t.personId),
    pgPolicy('allow_relative_select', {
      as: 'permissive',
      for: 'select',
      to: authenticatedRole,
      using: eq(t.relativeId, selectPersonId),
    }),
    policyAllowPersonInsertOwn(t.personId),
    policyAllowPersonUpdateOwn(t.personId),
    pgPolicy('allow_relative_update', {
      for: 'update',
      to: authenticatedRole,
      using: eq(t.relativeId, selectPersonId),
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
  () => [policyAllowAnyoneSelect],
)

export const personGender = pgTable(
  'person_lu_gender',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)

export const personRelationType = pgTable(
  'person_lu_relation_type',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)

export const personReligion = pgTable(
  'person_lu_religion',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)
