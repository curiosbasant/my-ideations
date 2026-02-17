import { index, pgPolicy, pgTableCreator } from 'drizzle-orm/pg-core'
import { eq, sql } from 'drizzle-orm/sql'

import { getDefaultTimezone, id } from '../utils/pg-column-helpers'
import { bucketNames, objects } from '../utils/supabase-helpers'

const pgTable = pgTableCreator((tableName) => `sf__${tableName}`)

export const sf__shortUrl = pgTable(
  'short_url',
  (c) => ({
    id: id.primaryKey(),
    code: c.varchar().notNull().unique(),
    url: c.text().notNull(),
    createdAt: getDefaultTimezone(),
  }),
  (t) => [
    index().on(t.createdAt.desc()),
    pgPolicy('Allow anyone to save a short code.', {
      for: 'insert',
      withCheck: sql`true`,
    }),
  ],
)

// ~~~~~~ Bucket Policies ~~~~~~

export const policyAllowFilesUpload = pgPolicy('Allow upload to anyone', {
  as: 'permissive',
  for: 'insert',
  withCheck: eq(objects.bucketId, sql.raw(`'${bucketNames.snapfileFiles}'`)),
}).link(objects)
