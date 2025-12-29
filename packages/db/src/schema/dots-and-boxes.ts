import { pgTableCreator } from 'drizzle-orm/pg-core'

import { getProfileRef, withCommonColumns } from '../utils/pg-column-helpers'

const pgTable = pgTableCreator((tableName) => `gdb__${tableName}`)

export const gdb__board = pgTable(
  'board',
  withCommonColumns((c) => ({
    rows: c.smallint().notNull(),
    cols: c.smallint().notNull(),
    boxes: c.json().default({}).$type<Record<string, number>>(),
    dashes: c.json().default({}).$type<Record<string, number>>(),
    activePlayerIndex: c.smallint(),
    players: getProfileRef().array(4).notNull(),
    status: c.varchar(),
  })),
)
