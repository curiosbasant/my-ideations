import type { AnyPgColumnBuilder } from 'drizzle-orm/pg-core'
import { getPgColumnBuilders, type PgColumnsBuilders } from 'drizzle-orm/pg-core/columns/all'

import { profile } from '../../schema/profile'
import { userProfileId } from '../helpers/db-functions'
import { getTimestampColumns, id } from './helpers'

export * from './helpers'

export const getProfileRef = () => id.references(() => profile.id).default(userProfileId)

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
