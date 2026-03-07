import { entityKind } from 'drizzle-orm/entity'
import { PgColumn, type PgTable, type ReferenceConfig } from 'drizzle-orm/pg-core'
import { PgIntColumnBuilder } from 'drizzle-orm/pg-core/columns/int.common'

export function smallId(name?: string) {
  return new PgSmallIdBuilder(name ?? '')
}
smallId.primaryKey = () => smallId().generatedByDefaultAsIdentity().primaryKey()
smallId.references = (columnRef: ReferenceConfig['ref'], actions?: ReferenceConfig['config']) =>
  smallId().references(
    columnRef,
    actions ? { onDelete: 'cascade', ...actions } : { onDelete: 'cascade' },
  )

class PgSmallIdBuilder extends PgIntColumnBuilder<{
  dataType: 'number int16'
  data: string
  driverParam: string | number
}> {
  static override [entityKind] = 'PgSmallIntBuilder'
  constructor(name: string) {
    super(name, 'number int16', 'PgSmallInt')
  }
  build(table: PgTable) {
    return new PgSmallId(table, this.config)
  }
}

class PgSmallId extends PgColumn<'number int16'> {
  static override [entityKind] = 'PgSmallInt'
  getSQLType() {
    return 'smallint'
  }
  override mapFromDriverValue(value: number | string) {
    if (typeof value === 'string') return value
    return String(value)
  }
  override mapToDriverValue(value: unknown) {
    if (typeof value === 'number') return value
    return Number(value)
  }
}
