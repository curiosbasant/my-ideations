import { json, pgTableCreator, smallint, uuid, varchar } from 'drizzle-orm/pg-core'

import { baseColumns } from './base'

const table = pgTableCreator((tableName) => `gdb__${tableName}`)

export const board = table('board', {
  ...baseColumns,
  rows: smallint().notNull(),
  cols: smallint().notNull(),
  boxes: json().default({}).$type<Record<string, number>>(),
  dashes: json().default({}).$type<Record<string, number>>(),
  activePlayerIndex: smallint(),
  players: uuid().array(4).notNull(),
  status: varchar(),
})
