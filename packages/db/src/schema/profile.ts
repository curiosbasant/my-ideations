// Note: Don't import anything from './base', as to avoid circular imports

import { bigint, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { authUsers } from 'drizzle-orm/supabase'

export const profile = pgTable('profile', {
  id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
  username: varchar({ length: 32 }).unique(),
  firstName: varchar({ length: 256 }),
  lastName: varchar({ length: 256 }),
  email: varchar({ length: 320 }).unique(),
  avatarUrl: varchar({ length: 256 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid().references(() => authUsers.id),
  updatedAt: timestamp({ withTimezone: true }),
})
