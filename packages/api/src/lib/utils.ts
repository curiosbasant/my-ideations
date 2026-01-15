import {
  coalesce,
  concat,
  eq,
  numNonnulls,
  schema,
  sql,
  type AnyColumn,
  type SQLWrapper,
} from '@my/db'

export function splitFullName(fullName: string): { firstName: string; lastName: string | null } {
  const parts = fullName.split(/ +/)
  if (parts.length === 1) return { firstName: fullName, lastName: null }
  if (parts.length === 2) return { firstName: parts[0], lastName: parts[1] }

  const lastName = parts.pop() ?? null
  return { firstName: parts.join(' '), lastName }
}

export const userDisplayName = coalesce<string>(
  sql.join([schema.profile.firstName, sql`' '`, schema.profile.lastName], sql`||`),
  schema.profile.firstName,
  schema.profile.lastName,
  schema.profile.username,
  concat(sql`'profile_'`, schema.profile.id),
).as('display_name')

export const isAllNotNull = (
  ...expressions: [arg: AnyColumn | SQLWrapper, ...(AnyColumn | SQLWrapper)[]]
) => eq(numNonnulls(...expressions), expressions.length)
