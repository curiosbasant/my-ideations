import type { AnyColumn, SQLWrapper } from 'drizzle-orm'
import { alias, type BuildAliasTable, type PgTable } from 'drizzle-orm/pg-core'
import { eq, sql } from 'drizzle-orm/sql'

import { person } from '../../schema/person'
import { profile } from '../../schema/profile'
import { coalesce, concat, concatWs, nullIf, numNonnulls } from './sql'

export const personFullName = () =>
  nullIf<string>(concatWs(' ', person.firstName, person.lastName), '')

export const profileDisplayName = () =>
  coalesce(
    nullIf(concatWs(' ', profile.firstName, profile.lastName), ''),
    profile.username,
    concat('profile_', sql`${profile.id}::text`),
  )

export const aliasExcluded = aliasedTableCreator('excluded')
export const aliasNew = aliasedTableCreator('new')
function aliasedTableCreator<TAlias extends string>(name: TAlias) {
  return <TTable extends PgTable, TReturn>(
    table: TTable,
    cb: (excluded: BuildAliasTable<TTable, TAlias>) => TReturn,
  ) => cb(alias(table, name))
}

export const isAllNotNull = (
  ...expressions: [arg: AnyColumn | SQLWrapper, ...(AnyColumn | SQLWrapper)[]]
) => eq(numNonnulls(...expressions), expressions.length)
