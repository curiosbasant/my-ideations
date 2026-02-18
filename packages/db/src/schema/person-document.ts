import { pgPolicy, primaryKey } from 'drizzle-orm/pg-core'
import { and, eq, or, sql } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

import { authUserPersonId, authUserProfileId } from '../utils/fn-helpers'
import {
  CASCADE_ON_UPDATE,
  getProfileRef,
  getTimestampColumns,
  id,
  smallId,
} from '../utils/pg-column-helpers'
import { pgTable, policyAllowPublicSelect } from '../utils/pg-table-helpers'
import { person } from './person'

export const personDocument = pgTable(
  'person_document',
  (c) => ({
    personId: id.references(() => person.id).notNull(),
    type: smallId.references(() => personDocumentType.id, CASCADE_ON_UPDATE).notNull(),
    number: c.text(),
    documentUrl: c.text(),
    createdBy: getProfileRef().notNull(),
    ...getTimestampColumns(),
  }),
  (t) => [
    primaryKey({ columns: [t.personId, t.type] }),
    pgPolicy('Allow select to self or person', {
      for: 'select',
      to: authenticatedRole,
      using: or(eq(t.personId, authUserPersonId), eq(t.createdBy, authUserProfileId)),
    }),
    pgPolicy('Allow insert to person', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: eq(t.personId, authUserPersonId),
    }),
    pgPolicy('Allow update to self or person', {
      for: 'update',
      to: authenticatedRole,
      using: or(eq(t.personId, authUserPersonId), eq(t.createdBy, authUserProfileId)),
    }),
  ],
)

// ~~~~~~ Lookup Tables ~~~~~~

export const personDocumentType = pgTable(
  'person_lu_document_type',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowPublicSelect],
)
