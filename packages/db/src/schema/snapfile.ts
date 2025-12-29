import { sql } from 'drizzle-orm'
import { index, pgPolicy, pgTableCreator } from 'drizzle-orm/pg-core'

import { getBaseColumns } from '../utils/pg-column-helpers'

const pgTable = pgTableCreator((tableName) => `sf__${tableName}`)

export const sf__shortUrl = pgTable(
  'short_url',
  (c) => ({
    id: getBaseColumns().id,
    code: c.varchar().notNull().unique(),
    url: c.text().notNull(),
    createdAt: getBaseColumns().createdAt,
  }),
  (t) => [
    index().on(t.createdAt.desc()),
    pgPolicy('Allow anyone to save a short code.', {
      for: 'insert',
      withCheck: sql`true`,
    }),
  ],
)
