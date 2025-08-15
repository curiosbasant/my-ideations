import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  varchar,
} from 'drizzle-orm/pg-core'

import { baseColumns, takeForeignId } from './base'

const table = pgTableCreator((tableName) => `sb__${tableName}`)

export const group = table('group', {
  ...baseColumns,
  name: varchar().notNull(),
})

export const member = table(
  'group_member',
  {
    groupId: takeForeignId(() => group.id).notNull(),
    userId: baseColumns.createdBy,
    joinedAt: baseColumns.createdAt,
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] })],
)

export const spend = table(
  'group_spend',
  {
    ...baseColumns,
    groupId: takeForeignId(() => group.id).notNull(),
    amount: integer().notNull(),
    note: text(),
  },
  (t) => [index().on(t.createdAt.desc(), t.groupId)],
)

export const notification = table(
  'notification',
  {
    ...baseColumns,
    type: varchar({ enum: ['group_spend_add', 'group_member_add'] }).notNull(),
    read: boolean().default(false),
    resourceId: text(),
    /** The user who receives the notification */
    userId: baseColumns.createdBy,
  },
  (t) => [index().on(t.userId.desc(), t.createdAt)],
)
