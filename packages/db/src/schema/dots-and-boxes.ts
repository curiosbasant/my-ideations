import { json, pgTableCreator, smallint, uuid, varchar } from 'drizzle-orm/pg-core'

import { getBaseColumns } from './base'

const table = pgTableCreator((tableName) => `db__${tableName}`)

export const board = table('board', {
  ...getBaseColumns(),
  rows: smallint('rows').notNull(),
  cols: smallint('cols').notNull(),
  boxes: json('boxes').default({}).$type<Record<string, number>>(),
  dashes: json('dashes').default({}).$type<Record<string, number>>(),
  activePlayerIndex: smallint('active_player_index'),
  players: uuid('players').array(4).notNull(),
  status: varchar('status'),
})
