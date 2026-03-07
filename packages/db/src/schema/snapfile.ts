import { index, pgPolicy, pgTableCreator } from 'drizzle-orm/pg-core'
import { eq, ne, not, or, sql } from 'drizzle-orm/sql'

import { bigId, getDefaultTimezone, withCommonColumns } from '../utils/helpers/column'
import { selectAuthRole } from '../utils/helpers/db-functions'
import {
  policyAllowAnyoneInsert,
  policyAllowAnyoneSelect,
  policyAllowProfileInsertOwn,
  policyAllowProfileUpdateOwn,
} from '../utils/helpers/policy'
import { coalesce } from '../utils/helpers/sql'
import { bucketNames, objects } from '../utils/helpers/supabase'

const pgTable = pgTableCreator((tableName) => `sf__${tableName}`)

export const sf__shortUrl = pgTable(
  'short_url',
  (c) => ({
    id: bigId.primaryKey(),
    code: c.varchar().notNull().unique(),
    url: c.text().notNull(),
    createdAt: getDefaultTimezone(),
  }),
  (t) => [index().on(t.createdAt.desc()), policyAllowAnyoneSelect, policyAllowAnyoneInsert],
)

export const sf__formats = pgTable(
  'formats',
  withCommonColumns((c) => ({
    name: c.varchar().notNull().unique(),
    description: c.text(),
    path: c.text().notNull(),
  })),
  (t) => [
    index().on(t.createdAt.desc()),
    policyAllowAnyoneSelect,
    policyAllowProfileInsertOwn(t.createdBy),
    policyAllowProfileUpdateOwn(t.createdBy),
  ],
)

// ~~~~~~ Bucket Policies ~~~~~~

const isSnapfileBucket = eq(objects.bucketId, sql.raw(`'${bucketNames.snapfileFiles}'`))

export const policyAllowFilesUpload = pgPolicy('allow_anyone_upload', {
  as: 'permissive',
  for: 'insert',
  to: 'public',
  withCheck: isSnapfileBucket,
}).link(objects)

export const policyAllowAuthenticatedUpload = pgPolicy('disallow_anyone_upload_in_formats', {
  as: 'restrictive',
  for: 'insert',
  to: 'public', // necessary for restrictive policy
  withCheck: or(
    not(isSnapfileBucket),
    ne(coalesce(sql`${objects.pathTokens}[1]`, sql.raw("''")), sql.raw(`'formats'`)),
    eq(selectAuthRole, sql.raw(`'authenticated'`)),
  ),
}).link(objects)
