import { TRPCError } from '@trpc/server'

export function ensureSingleRow<T>(rows: T[]): T {
  if (rows.length === 1) return rows[0]!
  throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
}
