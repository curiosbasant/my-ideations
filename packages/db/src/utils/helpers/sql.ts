import type { AnyColumn } from 'drizzle-orm'
import { sql, type SQLWrapper } from 'drizzle-orm/sql'
import type { SQLValue } from 'drizzle-plus/types'

export * from 'drizzle-orm/sql'
export { caseWhen, coalesce, concatWithSeparator as concatWs, nullif as nullIf } from 'drizzle-plus'

type Expression = AnyColumn | SQLWrapper
type MinRequiredArg<T, N extends number, _Acc extends T[] = []> =
  _Acc['length'] extends N ? [..._Acc, ...T[]] : MinRequiredArg<T, N, [..._Acc, T]>

const sqlComma = sql`, `

function pgFn<N extends number, T = unknown>(fnName: string) {
  const rawFnName = sql.raw(fnName)

  return <U = T>(...expressions: MinRequiredArg<Expression, N>) =>
    sql<U>`${rawFnName}(${sql.join(expressions, sqlComma)})`
}

export const numNonnulls = pgFn<1, number>('num_nonnulls')

export function concat(...args: MinRequiredArg<SQLValue<string | null>, 2>) {
  const chunks = args.map((arg) =>
    arg === null ? sql.raw('null')
    : typeof arg === 'string' ? sql.raw(`'${arg}'`)
    : arg,
  )
  return sql<string>`concat(${sql.join(chunks, sqlComma)})`
}

export const length = (column: Expression) => sql<number>`length(${column})`

export function splitPart(column: Expression, delimiter: string, position: number) {
  return sql`split_part(${column}, ${sql.raw(`'${delimiter}'`)}, ${sql.raw(position.toString())})`
}

export const now = () => sql`now()`

export function isDistinctFrom(left: AnyColumn | SQLWrapper, right: AnyColumn | SQLWrapper) {
  return sql`${left} is distinct from ${right}`
}
