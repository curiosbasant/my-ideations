import { pgTableCreator } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

import { id, withCommonColumns } from '../utils/pg-column-helpers'

const pgTable = pgTableCreator((tableName) => `gdb__${tableName}`)

export const gdb__board = pgTable(
  'board',
  withCommonColumns((c) => ({
    rows: c.smallint().notNull(),
    cols: c.smallint().notNull(),
    boxes: c.json().default({}).$type<Record<string, number>>(),
    dashes: c.json().default({}).$type<Record<string, number>>(),
    activePlayerIndex: c.smallint(),
    players: id()
      .array()
      .default(sql`array[get_auth_user_profile_id()]`)
      .notNull(),
    status: c.varchar(),
  })),
)
