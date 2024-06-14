import { SQL } from 'drizzle-orm'
import { PgColumn, type PgSelect } from 'drizzle-orm/pg-core'
import { jwtVerify } from 'jose'

import { z } from '@my/lib/zod'

export const idSchema = z.string()
export const userIdSchema = idSchema.uuid()

export function splitFullName(name: string): [string, string?] {
  name = name.trim().replace(/ +/, ' ')
  const li = name.lastIndexOf(' ')
  return li === -1 ? [name] : [name.slice(0, li), name.slice(li + 1)]
}

const jwtSecret = new TextEncoder().encode(process.env['SUPABASE_AUTH_JWT_SECRET']!)
export function getJwtPayload(token: string) {
  try {
    return jwtVerify<{ permissions_mask: number }>(token, jwtSecret)
  } catch (_) {
    return null
  }
}

export function withPagination<T extends PgSelect>(
  qb: T,
  options: { orderBy: PgColumn | SQL | SQL.Aliased; limit: number; page?: number },
) {
  qb = qb.orderBy(options.orderBy).limit(options.limit)
  return options.page ? qb.offset((options.page - 1) * options.limit) : qb
}
