import { sql, type AnyColumn, type SQLWrapper } from 'drizzle-orm'

type Expression = AnyColumn | SQLWrapper
type MinRequiredArg<T, N extends number, _Acc extends T[] = []> =
  _Acc['length'] extends N ? [..._Acc, ...T[]] : MinRequiredArg<T, N, [..._Acc, T]>

const sqlComma = sql`, `

function pgFn<N extends number, T = unknown>(fnName: string) {
  const rawFnName = sql.raw(fnName)

  return <U = T>(...expressions: MinRequiredArg<Expression, N>) =>
    sql<U>`${rawFnName}(${sql.join(expressions, sqlComma)})`
}

export const coalesce = pgFn<2>('coalesce')
export const concat = pgFn<2, string>('concat')
export const numNonnulls = pgFn<1, number>('num_nonnulls')
export const length = (column: Expression) => sql<number>`length(${column})`

export function nullIf<T>(expressionLeft: Expression, expressionRight: Expression | string) {
  return sql<T | null>`nullif(${expressionLeft}, ${expressionRight})`
}

export function concatWs(delimiter: string, ...expressions: MinRequiredArg<Expression, 2>) {
  return sql<string>`concat_ws(${delimiter}, ${sql.join(expressions, sqlComma)})`
}
