import { index, pgPolicy, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core'
import { eq, sql } from 'drizzle-orm/sql'
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase'

import { authUserProfileId } from '../utils/fn-helpers'
import { id, smallId } from '../utils/pg-column-helpers/helpers'
import {
  pgTable,
  policyAllowAuthenticatedInsert,
  policyAllowAuthenticatedSelect,
  policyAllowPublicSelect,
} from '../utils/pg-table-helpers'
import { person } from './person'

export const department = pgTable(
  'department',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.text().notNull(),
  }),
  () => [policyAllowPublicSelect],
)

export const designation = pgTable(
  'designation',
  (c) => ({
    id: smallId.primaryKey(),
    departmentId: smallId.references(() => department.id).notNull(),
    name: c.text().notNull(),
  }),
  (t) => [
    uniqueIndex().on(t.departmentId, t.name),
    policyAllowPublicSelect,
    policyAllowAuthenticatedInsert,
  ],
)

export const profile = pgTable(
  'profile',
  (c) => ({
    id: id.primaryKey(),
    username: c.varchar({ length: 32 }).unique(),
    firstName: c.varchar({ length: 256 }),
    lastName: c.varchar({ length: 256 }),
    email: c.varchar({ length: 320 }).unique(),
    avatarUrl: c.varchar({ length: 256 }),
    postId: smallId.references(() => designation.id, { onDelete: 'set null' }),
    personId: id.references(() => person.id, { onDelete: 'set null' }),
    createdBy: c
      .uuid()
      .references(() => authUsers.id, { onDelete: 'set null' })
      .default(sql`auth.uid()`),
    createdAt: c.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: c.timestamp({ withTimezone: true }),
  }),
  (t) => [
    index().on(t.createdBy),
    policyAllowAuthenticatedSelect,
    pgPolicy('Allow insert to self', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: eq(t.createdBy, authUid),
    }),
    pgPolicy('Allow update to self', {
      for: 'update',
      to: authenticatedRole,
      using: eq(t.createdBy, authUid),
    }),
  ],
)

export const policyAllowOneselfInsert = (profileId: PgColumn) =>
  pgPolicy('Allow insert to oneself', {
    for: 'insert',
    to: authenticatedRole,
    withCheck: eq(profileId, authUserProfileId),
  })

export const policyAllowOneselfUpdate = (profileId: PgColumn) =>
  pgPolicy('Allow update to oneself', {
    for: 'update',
    to: authenticatedRole,
    using: eq(profileId, authUserProfileId),
  })
