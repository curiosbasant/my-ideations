import { pgPolicy, type PgColumn } from 'drizzle-orm/pg-core'
import { eq, sql } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

import { selectPersonId, selectProfileId } from './db-functions'

// ~~~~~~ Anyone ~~~~~~
export const policyAllowAnyoneSelect = pgPolicy('allow_anyone_select', {
  as: 'permissive',
  for: 'select',
  to: 'public',
  using: sql`true`,
})

export const policyAllowAnyoneInsert = pgPolicy('allow_anyone_insert', {
  as: 'permissive',
  for: 'insert',
  to: 'public',
  withCheck: sql`true`,
})

// ~~~~~~ Authenticated ~~~~~~
export const policyAllowAuthenticatedSelect = pgPolicy('allow_authenticated_select', {
  as: 'permissive',
  for: 'select',
  to: authenticatedRole,
  using: sql`true`,
})

export const policyAllowAuthenticatedInsert = pgPolicy('allow_authenticated_insert', {
  as: 'permissive',
  for: 'insert',
  to: authenticatedRole,
  withCheck: sql`true`,
})

// ~~~~~~ Profile ~~~~~~
export const policyAllowProfileSelectOwn = (profileId: PgColumn) =>
  pgPolicy('allow_profile_select_own', {
    as: 'permissive',
    for: 'select',
    to: authenticatedRole,
    using: eq(profileId, selectProfileId),
  })

export const policyAllowProfileInsertOwn = (profileId: PgColumn) =>
  pgPolicy('allow_profile_insert_own', {
    as: 'permissive',
    for: 'insert',
    to: authenticatedRole,
    withCheck: eq(profileId, selectProfileId),
  })

export const policyAllowProfileUpdateOwn = (profileId: PgColumn) =>
  pgPolicy('allow_profile_update_own', {
    as: 'permissive',
    for: 'update',
    to: authenticatedRole,
    using: eq(profileId, selectProfileId),
  })

// ~~~~~~ Person ~~~~~~
export const policyAllowPersonSelectOwn = (personId: PgColumn) =>
  pgPolicy('allow_person_select_own', {
    as: 'permissive',
    for: 'select',
    to: authenticatedRole,
    using: eq(personId, selectPersonId),
  })

export const policyAllowPersonInsertOwn = (personId: PgColumn) =>
  pgPolicy('allow_person_insert_own', {
    as: 'permissive',
    for: 'insert',
    to: authenticatedRole,
    withCheck: eq(personId, selectPersonId),
  })

export const policyAllowPersonUpdateOwn = (personId: PgColumn) =>
  pgPolicy('allow_person_update_own', {
    as: 'permissive',
    for: 'update',
    to: authenticatedRole,
    using: eq(personId, selectPersonId),
  })
