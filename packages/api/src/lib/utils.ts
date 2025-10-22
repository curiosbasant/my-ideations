import { jwtVerify } from 'jose'

import {
  coalesce,
  db,
  eq,
  numNonnulls,
  schema,
  sql,
  type AnyColumn,
  type BinaryOperator,
  type SQLWrapper,
} from '@my/db'

export function splitFullName(name: string): [string, string?] {
  name = name.trim().replace(/ +/, ' ')
  const li = name.lastIndexOf(' ')
  return li === -1 ? [name] : [name.slice(0, li), name.slice(li + 1)]
}

const jwtSecret = new TextEncoder().encode(process.env['SUPABASE_JWT_SECRET']!)
export function getJwtPayload(token: string) {
  try {
    return jwtVerify<{ permissions_mask: number }>(token, jwtSecret)
  } catch {
    return null
  }
}

export const userDisplayName = coalesce<string>(
  sql.join([schema.profile.firstName, sql`' '`, schema.profile.lastName], sql`||`),
  // sql<string>`${schema.profile.firstName} || ' ' || ${schema.profile.lastName}`,
  schema.profile.firstName,
  schema.profile.lastName,
  schema.profile.username,
  sql`${schema.profile.id}::text`,
).as('display_name')

export const eqProfileId: BinaryOperator = (left: any, right: any) => {
  const profileId = db
    .select({ profileId: schema.profile.id })
    .from(schema.profile)
    .where(eq(schema.profile.createdBy, right))
    .as('profile_id')
  return eq(left, profileId)
}

export const isAllNotNull = (
  ...expressions: [arg: AnyColumn | SQLWrapper, ...(AnyColumn | SQLWrapper)[]]
) => eq(numNonnulls(...expressions), expressions.length)
