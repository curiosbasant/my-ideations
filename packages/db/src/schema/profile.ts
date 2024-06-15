// Note: Don't import anything from './base', as to avoid circular imports

import { pgSchema, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

const authSchema = pgSchema('auth')
const user = authSchema.table('users', {
  id: uuid('id').primaryKey(),
})

export const profile = pgTable('profile', {
  id: uuid('id')
    .primaryKey()
    .references(() => user.id),
  username: varchar('username', { length: 32 }).unique(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 }),
  email: varchar('email', { length: 320 }).unique(),
  avatarUrl: varchar('avatar_url', { length: 256 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})
