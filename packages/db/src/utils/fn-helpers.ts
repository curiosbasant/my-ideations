import {
  getColumns,
  getTableName,
  or,
  SQL,
  sql,
  type AnyColumn,
  type SQLWrapper,
} from 'drizzle-orm'
import { toSnakeCase } from 'drizzle-orm/casing'
import type { PgTable } from 'drizzle-orm/pg-core'

import { person } from '../schema/person'
import { concatWs, nullIf } from './pg-functions'

export const authUserPersonId = sql<number>`get_auth_user_person_id()`
export const authUserProfileId = sql<number>`get_auth_user_profile_id()`

export const personFullName = () =>
  nullIf<string>(concatWs(' ', person.firstName, person.lastName), '')

export function buildConflictUpdateColumns<T extends PgTable, C extends keyof T['_']['columns']>(
  table: T,
  columns: C[],
) {
  const cls = getColumns(table)
  const excludedIdentifier = sql.identifier('excluded')
  return columns.reduce(
    (acc, column) => {
      const colName = cls[column].name
      acc[column] = sql`${excludedIdentifier}.${sql.identifier(toSnakeCase(colName))}`
      return acc
    },
    {} as Record<C, SQL>,
  )
}

export function buildConflictSetWhere<T extends PgTable, C extends keyof T['_']['columns']>(
  table: T,
  columns: C[],
) {
  const cls = getColumns(table)
  const tableIdentifier = sql.identifier(getTableName(table))
  const excludedIdentifier = sql.identifier('excluded')
  return or(
    ...columns.map((c) => {
      const cId = sql.identifier(toSnakeCase(cls[c].name))
      return isDistinctFrom(sql`${tableIdentifier}.${cId}`, sql`${excludedIdentifier}.${cId}`)
    }),
  )
}

export function isDistinctFrom(left: AnyColumn | SQLWrapper, right: AnyColumn | SQLWrapper) {
  return sql`${left} is distinct from ${right}`
}
