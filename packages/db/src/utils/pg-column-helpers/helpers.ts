// ~~~~ This file is separated out to avoid circular imports for '~/schema/profile' ~~
import { bigint, smallint, timestamp, type ReferenceConfig } from 'drizzle-orm/pg-core'

export const CASCADE_ON_UPDATE = { onUpdate: 'cascade' as const }
export const CASCADE_ON_DELETE = { onDelete: 'cascade' as const }

export const smallId = () => smallint()
smallId.primaryKey = () => smallint().generatedByDefaultAsIdentity().primaryKey()
smallId.references = (columnRef: ReferenceConfig['ref'], actions?: ReferenceConfig['config']) =>
  smallint().references(
    columnRef,
    actions ? { ...CASCADE_ON_DELETE, ...actions } : CASCADE_ON_DELETE,
  )

export const id = () => bigint({ mode: 'number' })
id.primaryKey = () => id().generatedByDefaultAsIdentity().primaryKey()
id.references = (columnRef: ReferenceConfig['ref'], actions?: ReferenceConfig['config']) =>
  id().references(columnRef, actions ? { ...CASCADE_ON_DELETE, ...actions } : CASCADE_ON_DELETE)

export const getDefaultTimezone = () => timestamp({ withTimezone: true }).notNull().defaultNow()
export const getTimestampColumns = () => ({
  createdAt: getDefaultTimezone(),
  updatedAt: timestamp({ withTimezone: true }),
})
