import { pgPolicy, pgTableCreator } from 'drizzle-orm/pg-core'
import { eq, sql } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

export const pgTable = pgTableCreator((tableName) => `__${tableName}`)

// Public
export const policyAllowPublicSelect = pgPolicy('Allow select to public', {
  for: 'select',
  using: sql`true`,
})

// Authenticated
export const policyAllowAuthenticatedSelect = pgPolicy('Allow select to authenticated', {
  for: 'select',
  to: authenticatedRole,
  using: sql`true`,
})

export const policyAllowAuthenticatedInsert = pgPolicy('Allow insert to authenticated', {
  for: 'insert',
  to: authenticatedRole,
  withCheck: sql`true`,
})

// Self
const isSelf = eq(sql.identifier('created_by'), sql<number>`(select get_auth_user_profile_id())`)

export const policyAllowSelfInsert = pgPolicy('Allow insert to self', {
  for: 'insert',
  to: authenticatedRole,
  withCheck: isSelf,
})

export const policyAllowSelfUpdate = pgPolicy('Allow update to self', {
  for: 'update',
  to: authenticatedRole,
  using: isSelf,
})
