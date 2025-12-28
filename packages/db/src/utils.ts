import { sql, type AnyColumn, type GetColumnData, type SQL, type SQLWrapper } from 'drizzle-orm'

type MinRequiredArg<T, N extends number, _Acc extends T[] = []> =
  _Acc['length'] extends N ? [..._Acc, ...T[]] : MinRequiredArg<T, N, [..._Acc, T]>

function pgFn<N extends number, T = unknown>(fnName: string) {
  const rawFnName = sql.raw(fnName)
  return <U = T>(...expressions: MinRequiredArg<AnyColumn | SQLWrapper, N>) =>
    sql<U>`${rawFnName}(${sql.join(expressions, sql`,`)})`
}
export const coalesce = pgFn<2>('coalesce')
export const concat = pgFn<2, string>('concat')
export const numNulls = pgFn<1, number>('num_nulls')
export const numNonnulls = pgFn<1, number>('num_nonnulls')

export const splitPart = (column: AnyColumn | SQLWrapper, delimiter: string, part: number) =>
  sql<string>`split_part(${column}, ${delimiter}, ${part})`

export const aliasedColumn = <T extends AnyColumn>(
  column: T,
  alias: string,
): SQL.Aliased<GetColumnData<T>> => {
  return column.getSQL().mapWith(column.mapFromDriverValue).as(alias)
}

export const ST_DWithin = (column: AnyColumn, otherColumn: AnyColumn, distance: number) =>
  sql`ST_DWithin(${column}::geography, ${otherColumn}::geography, ${distance})`
