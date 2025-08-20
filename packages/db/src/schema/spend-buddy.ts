import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  varchar,
} from 'drizzle-orm/pg-core'

import { getBaseColumns, takeForeignId } from './base'

const table = pgTableCreator((tableName) => `sb__${tableName}`)

export const group = table('group', {
  ...getBaseColumns(),
  name: varchar().notNull(),
})

export const member = table(
  'group_member',
  {
    groupId: takeForeignId(() => group.id).notNull(),
    userId: getBaseColumns().createdBy,
    joinedAt: getBaseColumns().createdAt,
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] })],
)

export const spend = table(
  'group_spend',
  {
    ...getBaseColumns(),
    groupId: takeForeignId(() => group.id).notNull(),
    amount: integer().notNull(),
    note: text(),
  },
  (t) => [index().on(t.createdAt.desc(), t.groupId)],
)

export const notification = table(
  'notification',
  {
    ...getBaseColumns(),
    type: varchar({ enum: ['group_spend_add', 'group_member_join'] }).notNull(),
    read: boolean().default(false),
    resourceId: text(),
    /** The user who receives the notification */
    userId: getBaseColumns().createdBy,
  },
  (t) => [index().on(t.userId.desc(), t.createdAt)],
)
