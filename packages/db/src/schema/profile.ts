import { index, pgPolicy, uniqueIndex } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm/sql'
import { authenticatedRole, authUsers } from 'drizzle-orm/supabase'

import { authUserId, selectUserId } from '../utils/helpers/db-functions'
import {
  policyAllowAnyoneSelect,
  policyAllowAuthenticatedInsert,
  policyAllowAuthenticatedSelect,
} from '../utils/helpers/policy'
import { pgTable } from '../utils/helpers/table'
import { bigId, smallId } from '../utils/pg-column-helpers/helpers'
import { person } from './person'

export const department = pgTable(
  'department',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.text().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
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
    policyAllowAnyoneSelect,
    policyAllowAuthenticatedInsert,
  ],
)

export const profile = pgTable(
  'profile',
  (c) => ({
    id: bigId.primaryKey(),
    username: c.varchar({ length: 32 }).unique(),
    firstName: c.varchar({ length: 256 }),
    lastName: c.varchar({ length: 256 }),
    email: c.varchar({ length: 320 }).unique(),
    avatarUrl: c.varchar({ length: 256 }),
    postId: smallId.references(() => designation.id, { onDelete: 'set null' }),
    personId: bigId.references(() => person.id, { onDelete: 'set null' }),
    createdBy: c
      .uuid()
      .references(() => authUsers.id, { onDelete: 'set null' })
      .default(authUserId),
    createdAt: c.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: c.timestamp({ withTimezone: true }),
  }),
  (t) => [
    index().on(t.createdBy),
    policyAllowAuthenticatedSelect,
    pgPolicy('allow_user_insert_own_profile', {
      as: 'permissive',
      for: 'insert',
      to: authenticatedRole,
      withCheck: eq(t.createdBy, selectUserId),
    }),
    pgPolicy('allow_user_update_own_profile', {
      as: 'permissive',
      for: 'update',
      to: authenticatedRole,
      using: eq(t.createdBy, selectUserId),
    }),
  ],
)
