import { sql, type AnyColumn, type SQLWrapper } from 'drizzle-orm'

type MinRequiredArg<T, N extends number, _Acc extends T[] = []> =
  _Acc['length'] extends N ? [..._Acc, ...T[]] : MinRequiredArg<T, N, [..._Acc, T]>

function pgFn<N extends number, T = unknown>(fnName: string) {
  const rawFnName = sql.raw(fnName)
  return <U = T>(...expressions: MinRequiredArg<AnyColumn | SQLWrapper, N>) =>
    sql<U>`${rawFnName}(${sql.join(expressions, sql`,`)})`
}
export const coalesce = pgFn<2>('coalesce')
export const concat = pgFn<2, string>('concat')
export const numNonnulls = pgFn<1, number>('num_nonnulls')
