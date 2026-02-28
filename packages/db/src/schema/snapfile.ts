import { index, pgPolicy, pgTableCreator } from 'drizzle-orm/pg-core'
import { eq, ne, not, or, sql } from 'drizzle-orm/sql'

import { selectAuthRole } from '../utils/helpers/db-functions'
import { coalesce } from '../utils/helpers/sql'
import { bucketNames, objects } from '../utils/helpers/supabase'
import { getDefaultTimezone, id, withCommonColumns } from '../utils/pg-column-helpers'
import { policyAllowPublicInsert, policyAllowPublicSelect } from '../utils/pg-table-helpers'
import { policyAllowOneselfInsert, policyAllowOneselfUpdate } from './profile'

const pgTable = pgTableCreator((tableName) => `sf__${tableName}`)

export const sf__shortUrl = pgTable(
  'short_url',
  (c) => ({
    id: id.primaryKey(),
    code: c.varchar().notNull().unique(),
    url: c.text().notNull(),
    createdAt: getDefaultTimezone(),
  }),
  (t) => [index().on(t.createdAt.desc()), policyAllowPublicSelect, policyAllowPublicInsert],
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
    policyAllowPublicSelect,
    policyAllowOneselfInsert(t.createdBy),
    policyAllowOneselfUpdate(t.createdBy),
  ],
)

// ~~~~~~ Bucket Policies ~~~~~~
const isSnapfileBucket = eq(objects.bucketId, sql.raw(`'${bucketNames.snapfileFiles}'`))

export const policyAllowFilesUpload = pgPolicy('Allow upload to anyone', {
  as: 'permissive',
  for: 'insert',
  withCheck: isSnapfileBucket,
}).link(objects)

export const policyAllowAuthenticatedUpload = pgPolicy(
  'Allow upload in formats to only authenticated',
  {
    as: 'restrictive',
    for: 'insert',
    to: 'public', // necessary for restrictive policy
    withCheck: or(
      not(isSnapfileBucket),
      ne(coalesce(sql`${objects.pathTokens}[1]`, sql.raw("''")), sql.raw(`'formats'`)),
      eq(selectAuthRole, sql.raw(`'authenticated'`)),
    ),
  },
).link(objects)
