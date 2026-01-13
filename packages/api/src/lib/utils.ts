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

export function splitFullName(name: string): [string, string?] {
  name = name.trim().replace(/ +/, ' ')
  const li = name.lastIndexOf(' ')
  return li === -1 ? [name] : [name.slice(0, li), name.slice(li + 1)]
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
