import { bigint, PgColumn, timestamp } from 'drizzle-orm/pg-core'

import { profile } from './profile'

const id = () => bigint({ mode: 'number' })
export const CASCADE_ON_DELETE = { onDelete: 'cascade' as const }

export const takeForeignId = (columnRef: () => PgColumn) =>
  id().references(columnRef, CASCADE_ON_DELETE)

export const getTimestampColumns = () => ({
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }),
})
export const getBaseColumns = () => ({
  id: id().generatedByDefaultAsIdentity().primaryKey(),
  createdBy: takeForeignId(() => profile.id).notNull(),
  ...getTimestampColumns(),
})
