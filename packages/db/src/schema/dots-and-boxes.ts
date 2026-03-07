import { pgTableCreator } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

import { bigId, withCommonColumns } from '../utils/helpers/column'
import { userProfileId } from '../utils/helpers/db-functions'

const pgTable = pgTableCreator((tableName) => `gdb__${tableName}`)

export const gdb__board = pgTable(
  'board',
  withCommonColumns((c) => ({
    rows: c.smallint().notNull(),
    cols: c.smallint().notNull(),
    boxes: c.json().default({}).$type<Record<string, number>>(),
    dashes: c.json().default({}).$type<Record<string, number>>(),
    activePlayerIndex: c.smallint(),
    players: bigId()
      .array()
      .default(sql`ARRAY[${userProfileId}]`)
      .notNull(),
    status: c.varchar(),
  })),
)
