import { pgPolicy, pgTableCreator } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

export const pgTable = pgTableCreator((tableName) => `__${tableName}`)

// Public
export const policyAllowPublicSelect = pgPolicy('Allow select to public', {
  as: 'permissive',
  for: 'select',
  using: sql`true`,
})

export const policyAllowPublicInsert = pgPolicy('Allow insert to public', {
  as: 'permissive',
  for: 'insert',
  withCheck: sql`true`,
})

// Authenticated
export const policyAllowAuthenticatedSelect = pgPolicy('Allow select to authenticated', {
  as: 'permissive',
  for: 'select',
  to: authenticatedRole,
  using: sql`true`,
})

export const policyAllowAuthenticatedInsert = pgPolicy('Allow insert to authenticated', {
  as: 'permissive',
  for: 'insert',
  to: authenticatedRole,
  withCheck: sql`true`,
})
