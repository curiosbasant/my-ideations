import { index, pgPolicy, pgTableCreator } from 'drizzle-orm/pg-core'
import { and, eq, sql } from 'drizzle-orm/sql'

import {
  bigId,
  getDefaultTimezone,
  getProfileRef,
  getTimestampColumns,
  withCommonColumns,
} from '../utils/helpers/column'
import { selectAuthRole } from '../utils/helpers/db-functions'
import {
  policyAllowAnyoneInsert,
  policyAllowAnyoneSelect,
  policyAllowAuthenticatedInsert,
  policyAllowProfileInsertOwn,
  policyAllowProfileUpdateOwn,
} from '../utils/helpers/policy'
import { caseWhen } from '../utils/helpers/sql'
import { bucketNames, objects } from '../utils/helpers/supabase'

const pgTable = pgTableCreator((tableName) => `sf__${tableName}`)

export const sf__room = pgTable(
  'room',
  withCommonColumns((c) => ({
    name: c.varchar().notNull(),
    slug: c.varchar().notNull().unique(),
  })),
  () => [policyAllowAnyoneSelect, policyAllowAuthenticatedInsert],
)

export const sf__roomFile = pgTable(
  'room_file',
  (c) => ({
    id: bigId.primaryKey(),
    roomId: bigId.references(() => sf__room.id).notNull(),
    path: c.text().notNull(),
    createdBy: getProfileRef(),
    ...getTimestampColumns(),
  }),
  () => [policyAllowAnyoneSelect, policyAllowAnyoneInsert],
)

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

const isSnapfileBucket = and(
  eq(objects.bucketId, sql.raw(`'${bucketNames.snapfileFiles}'`)),
  caseWhen(
    eq(sql`${objects.pathTokens}[1]`, sql.raw(`'formats'`)),
    eq(selectAuthRole, sql.raw(`'authenticated'`)),
  ).else(sql`true`),
)

export const policyAllowFilesSelect = pgPolicy('allow_anyone_select_snapfile', {
  as: 'permissive',
  for: 'select',
  to: 'public',
  using: isSnapfileBucket,
}).link(objects)

export const policyAllowFilesUpload = pgPolicy('allow_anyone_upload_snapfile', {
  as: 'permissive',
  for: 'insert',
  to: 'public',
  withCheck: isSnapfileBucket,
}).link(objects)
