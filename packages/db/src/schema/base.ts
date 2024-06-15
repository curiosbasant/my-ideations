import { sql } from 'drizzle-orm'
import { text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { profile } from './profile'

export const getUserIdColumn = (columnName = 'user_id') =>
  uuid(columnName)
    .default(sql<string>`auth.uid()`)
    .notNull()
    .references(() => profile.id, CASCADE_ON_DELETE)

export const getCurrentTimestampColumn = (columnName = 'created_at') =>
  timestamp(columnName, { withTimezone: true }).defaultNow().notNull()

export const getPrimaryIdColumn = (columnName = 'id') =>
  text(columnName)
    .primaryKey()
    .default(sql<string>`generate_random_id(12)`)
export const getUniqueIdColumn = (columnName = 'id') =>
  text(columnName)
    .unique()
    .notNull()
    .default(sql<string>`generate_random_id(12)`)

export const getBaseColumns = () => ({
  id: getPrimaryIdColumn(),
  createdAt: getCurrentTimestampColumn(),
  createdBy: getUserIdColumn('created_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})

export const CASCADE_ON_DELETE = { onDelete: 'cascade' as const }
