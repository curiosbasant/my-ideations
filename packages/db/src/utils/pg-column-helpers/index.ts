import type { PgColumnBuilderBase } from 'drizzle-orm/pg-core'
import { getPgColumnBuilders, type PgColumnsBuilders } from 'drizzle-orm/pg-core/columns/all'

import { profile } from '../../schema/profile'
import { getTimestampColumns, id } from './helpers'

export * from './helpers'

export const getProfileRef = () => id.references(() => profile.id)

export function withCommonColumns<TColumnsMap extends Record<string, PgColumnBuilderBase>>(
  columns: (columnTypes: PgColumnsBuilders) => TColumnsMap,
) {
  return {
    id: id.primaryKey(),
    ...columns(getPgColumnBuilders()),
    createdBy: getProfileRef().notNull(),
    ...getTimestampColumns(),
  }
}
