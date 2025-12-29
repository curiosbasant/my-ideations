// Note: Don't import anything from './base', as to avoid circular imports

import { index, uniqueIndex } from 'drizzle-orm/pg-core'
import { authUsers } from 'drizzle-orm/supabase'

import { pgTable, selectOnlyPolicy } from '../utils/pg-table-helpers'

export const department = pgTable(
  'department',
  (c) => ({
    id: c.smallint().primaryKey(),
    name: c.text().notNull(),
  }),
  () => [selectOnlyPolicy],
)

export const designation = pgTable(
  'designation',
  (c) => ({
    id: c.smallint().generatedByDefaultAsIdentity().primaryKey(),
    departmentId: c
      .smallint()
      .references(() => department.id, { onDelete: 'cascade' })
      .notNull(),
    name: c.text().notNull(),
  }),
  (t) => [uniqueIndex().on(t.departmentId, t.name), selectOnlyPolicy],
)

export const profile = pgTable(
  'profile',
  (c) => ({
    id: c.bigint({ mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    username: c.varchar({ length: 32 }).unique(),
    firstName: c.varchar({ length: 256 }),
    lastName: c.varchar({ length: 256 }),
    email: c.varchar({ length: 320 }).unique(),
    avatarUrl: c.varchar({ length: 256 }),
    postId: c.smallint().references(() => designation.id, { onDelete: 'set null' }),
    createdBy: c.uuid().references(() => authUsers.id),
    createdAt: c.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: c.timestamp({ withTimezone: true }),
  }),
  (t) => [index().on(t.createdBy)],
)
