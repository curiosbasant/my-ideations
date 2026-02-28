import { getColumns, getTableName, type AnyColumn, type SQLWrapper } from 'drizzle-orm'
import { toSnakeCase } from 'drizzle-orm/casing'
import type { PgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core'
import { eq, or, sql, type SQL } from 'drizzle-orm/sql'

import { person } from '../../schema/person'
import { profile } from '../../schema/profile'
import { coalesce, concat, concatWs, isDistinctFrom, nullIf, numNonnulls } from './sql'

export const personFullName = () =>
  nullIf<string>(concatWs(' ', person.firstName, person.lastName), '')

export const profileDisplayName = () =>
  coalesce(
    nullIf(concatWs(' ', profile.firstName, profile.lastName), ''),
    profile.username,
    concat('profile_', sql`${profile.id}::text`),
  )

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

export function withExcluded<T extends PgTable>(
  table: T,
  cb: (excluded: T['_']['columns']) => PgUpdateSetSource<T>,
) {
  const columns = getColumns(table)
  const excludedIdentifier = sql.identifier('excluded')
  const tableProxy = new Proxy(columns, {
    get(target, prop) {
      if (typeof prop !== 'string') return null
      const cId = sql.identifier(toSnakeCase(target[prop].name))
      return sql`${excludedIdentifier}.${cId}`
    },
  })

  return cb(tableProxy)
}

export const isAllNotNull = (
  ...expressions: [arg: AnyColumn | SQLWrapper, ...(AnyColumn | SQLWrapper)[]]
) => eq(numNonnulls(...expressions), expressions.length)
