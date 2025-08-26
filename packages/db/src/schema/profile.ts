// Note: Don't import anything from './base', as to avoid circular imports

import { index, pgTable } from 'drizzle-orm/pg-core'
import { authUsers } from 'drizzle-orm/supabase'

export const profile = pgTable(
  'profile',
  (c) => ({
    id: c.bigint({ mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    username: c.varchar({ length: 32 }).unique(),
    firstName: c.varchar({ length: 256 }),
    lastName: c.varchar({ length: 256 }),
    email: c.varchar({ length: 320 }).unique(),
    avatarUrl: c.varchar({ length: 256 }),
    createdBy: c.uuid().references(() => authUsers.id),
    createdAt: c.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: c.timestamp({ withTimezone: true }),
  }),
  (t) => [index().on(t.createdBy)],
)
