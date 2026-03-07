// ~~ This file is separated out to avoid circular imports for '~/schema/profile' ~~
import { bigint, timestamp, type ReferenceConfig } from 'drizzle-orm/pg-core'

export const CASCADE_ON_UPDATE = { onUpdate: 'cascade' as const }
export const CASCADE_ON_DELETE = { onDelete: 'cascade' as const }

export const bigId = () => bigint({ mode: 'string' })
bigId.primaryKey = () => bigId().generatedAlwaysAsIdentity().primaryKey()
bigId.references = (columnRef: ReferenceConfig['ref'], actions?: ReferenceConfig['config']) =>
  bigId().references(columnRef, actions ? { ...CASCADE_ON_DELETE, ...actions } : CASCADE_ON_DELETE)

export const getDefaultTimezone = () => timestamp({ withTimezone: true }).notNull().defaultNow()
export const getTimestampColumns = () => ({
  createdAt: getDefaultTimezone(),
  updatedAt: timestamp({ withTimezone: true }),
})
