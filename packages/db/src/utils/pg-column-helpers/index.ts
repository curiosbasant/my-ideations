import type { AnyPgColumnBuilder } from 'drizzle-orm/pg-core'
import { getPgColumnBuilders, type PgColumnsBuilders } from 'drizzle-orm/pg-core/columns/all'
import { sql } from 'drizzle-orm/sql'

import { profile } from '../../schema/profile'
import { getTimestampColumns, id } from './helpers'

export * from './helpers'

export const getProfileRef = () =>
  id.references(() => profile.id).default(sql`get_auth_user_profile_id()`)

export function withCommonColumns<TColumnsMap extends Record<string, AnyPgColumnBuilder>>(
  columns: (columnTypes: PgColumnsBuilders) => TColumnsMap,
) {
  return {
    id: id.primaryKey(),
    ...columns(getPgColumnBuilders()),
    createdBy: getProfileRef().notNull(),
    ...getTimestampColumns(),
  }
}
