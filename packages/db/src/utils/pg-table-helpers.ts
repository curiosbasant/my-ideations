import { pgPolicy, pgTableCreator } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

export const pgTable = pgTableCreator((tableName) => `__${tableName}`)

export const selectOnlyPolicy = pgPolicy('allow_select_to_all', {
  for: 'select',
  using: sql`true`,
})

export const insertOnlyPolicy = pgPolicy('allow_insert_to_all', {
  for: 'insert',
  withCheck: sql`true`,
})
