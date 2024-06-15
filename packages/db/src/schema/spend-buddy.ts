import { index, integer, pgTableCreator, primaryKey, text, varchar } from 'drizzle-orm/pg-core'

import { getBaseColumns, getCurrentTimestampColumn, getUserIdColumn } from './base'

const table = pgTableCreator((tableName) => `sb__${tableName}`)

export const group = table('group', {
  ...getBaseColumns(),
  name: varchar('name').notNull(),
})

export const member = table(
  'group_member',
  {
    groupId: text('group_id').references(() => group.id),
    userId: getUserIdColumn('user_id'),
    joinedAt: getCurrentTimestampColumn('joined_at'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.userId] }),
  }),
)

export const spend = table(
  'group_spend',
  {
    ...getBaseColumns(),
    groupId: text('group_id').references(() => group.id),
    amount: integer('amount').notNull(),
    note: text('note'),
  },
  (t) => ({
    groupIndex: index().on(t.groupId),
    userIndex: index().on(t.createdBy),
  }),
)
