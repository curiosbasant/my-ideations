import type { AnyPgColumnBuilder } from 'drizzle-orm/pg-core'
import { getPgColumnBuilders, type PgColumnsBuilders } from 'drizzle-orm/pg-core/columns/all'

import { profile } from '../../../schema/profile'
import { userProfileId } from '../db-functions'
import { bigId, getTimestampColumns } from './helpers'

export * from './helpers'
export * from './small-id'

export const getProfileRef = () => bigId.references(() => profile.id).default(userProfileId)

export function withCommonColumns<TColumnsMap extends Record<string, AnyPgColumnBuilder>>(
  columns: (columnTypes: PgColumnsBuilders) => TColumnsMap,
) {
  return {
    id: bigId.primaryKey(),
    ...columns(getPgColumnBuilders()),
    createdBy: getProfileRef().notNull(),
    ...getTimestampColumns(),
  }
}
