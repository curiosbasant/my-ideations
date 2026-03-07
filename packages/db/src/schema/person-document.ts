import { pgPolicy, primaryKey } from 'drizzle-orm/pg-core'
import { and, eq, inArray, sql } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

import { userPersonId } from '../utils/helpers/db-functions'
import {
  policyAllowAnyoneSelect,
  policyAllowPersonInsertOwn,
  policyAllowPersonSelectOwn,
  policyAllowPersonUpdateOwn,
  policyAllowProfileSelectOwn,
  policyAllowProfileUpdateOwn,
} from '../utils/helpers/policy'
import { bucketNames, objects } from '../utils/helpers/supabase'
import { pgTable } from '../utils/helpers/table'
import {
  bigId,
  CASCADE_ON_UPDATE,
  getProfileRef,
  getTimestampColumns,
  smallId,
} from '../utils/pg-column-helpers'
import { qb } from '../utils/qb'
import { person, personRelation } from './person'

export const personDocument = pgTable(
  'person_document',
  (c) => ({
    personId: bigId.references(() => person.id).notNull(),
    type: smallId.references(() => personDocumentType.id, CASCADE_ON_UPDATE).notNull(),
    number: c.text(),
    path: c.text(),
    note: c.text(),
    createdBy: getProfileRef().notNull(),
    ...getTimestampColumns(),
  }),
  (t) => [
    primaryKey({ columns: [t.personId, t.type] }),
    policyAllowPersonSelectOwn(t.personId),
    policyAllowProfileSelectOwn(t.createdBy),
    policyAllowPersonInsertOwn(t.personId),
    pgPolicy('allow_person_insert_for_relatives', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: inArray(
        t.personId,
        qb
          .select({ relativeId: personRelation.relativeId })
          .from(personRelation)
          .where(eq(personRelation.personId, userPersonId)),
      ),
    }),
    policyAllowPersonUpdateOwn(t.personId),
    policyAllowProfileUpdateOwn(t.createdBy),
  ],
)

// ~~~~~~ Lookup Tables ~~~~~~

export const personDocumentType = pgTable(
  'person_lu_document_type',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAnyoneSelect],
)

// ~~~~~~ Bucket Policies ~~~~~~

const conditionPersonFolder = and(
  eq(objects.bucketId, sql.raw(`'${bucketNames.documents}'`)),
  eq(sql`${objects.pathTokens}[1]`, sql`${userPersonId}::text`),
)

export const allowSelectOwnDocument = pgPolicy('allow_person_select_own_document', {
  as: 'permissive',
  for: 'select',
  to: authenticatedRole,
  using: conditionPersonFolder,
}).link(objects)

export const allowUploadOwnDocument = pgPolicy('allow_person_upload_own_document', {
  as: 'permissive',
  for: 'insert',
  to: authenticatedRole,
  withCheck: conditionPersonFolder,
}).link(objects)
