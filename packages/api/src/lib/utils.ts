import { jwtVerify } from 'jose'

import { schema, sql } from '@my/db'

export function splitFullName(name: string): [string, string?] {
  name = name.trim().replace(/ +/, ' ')
  const li = name.lastIndexOf(' ')
  return li === -1 ? [name] : [name.slice(0, li), name.slice(li + 1)]
}

const jwtSecret = new TextEncoder().encode(process.env['SUPABASE_JWT_SECRET']!)
export function getJwtPayload(token: string) {
  try {
    return jwtVerify<{ permissions_mask: number }>(token, jwtSecret)
  } catch (_) {
    return null
  }
}

export const userDisplayName =
  sql<string>`coalesce(${schema.profile.firstName} || ' ' || ${schema.profile.lastName}, ${schema.profile.firstName}, ${schema.profile.lastName}, ${schema.profile.username}, ${schema.profile.id}::text)`.as(
    'display_name',
  )
