import { sql, type HasDefault, type NotNull } from 'drizzle-orm'
import { text, timestamp, uuid, type PgUUIDBuilderInitial } from 'drizzle-orm/pg-core'

import { profile } from './profile'

export function getUserIdColumn<T extends string>(
  columnName: T,
): NotNull<HasDefault<PgUUIDBuilderInitial<T>>>
export function getUserIdColumn<T extends string>(
  columnName: T,
  setDefault: false,
): NotNull<PgUUIDBuilderInitial<T>>
export function getUserIdColumn(columnName = 'user_id', setDefault = true) {
  return (setDefault ? uuid(columnName).default(sql<string>`auth.uid()`) : uuid(columnName))
    .notNull()
    .references(() => profile.id, CASCADE_ON_DELETE)
}

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
