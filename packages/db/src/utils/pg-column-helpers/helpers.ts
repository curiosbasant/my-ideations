// ~~~~ This file is separated out to avoid circular imports for '~/schema/profile' ~~
import { bigint, smallint, timestamp, type ReferenceConfig } from 'drizzle-orm/pg-core'

export const CASCADE_ON_DELETE = { onDelete: 'cascade' as const }

export const smallId = () => smallint()
smallId.primaryKey = () => smallint().generatedByDefaultAsIdentity().primaryKey()
smallId.references = (
  columnRef: ReferenceConfig['ref'],
  actions: ReferenceConfig['actions'] = CASCADE_ON_DELETE,
) => smallint().references(columnRef, actions)

export const id = () => bigint({ mode: 'number' })
id.primaryKey = () => id().generatedByDefaultAsIdentity().primaryKey()
id.references = (
  columnRef: ReferenceConfig['ref'],
  actions: ReferenceConfig['actions'] = CASCADE_ON_DELETE,
) => id().references(columnRef, actions)

export const getDefaultTimezone = () => timestamp({ withTimezone: true }).notNull().defaultNow()
export const getTimestampColumns = () => ({
  createdAt: getDefaultTimezone(),
  updatedAt: timestamp({ withTimezone: true }),
})
