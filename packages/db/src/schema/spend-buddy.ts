import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  varchar,
} from 'drizzle-orm/pg-core'

import {
  CASCADE_ON_DELETE,
  getBaseColumns,
  getCurrentTimestampColumn,
  getUserIdColumn,
} from './base'

const table = pgTableCreator((tableName) => `sb__${tableName}`)

export const group = table('group', {
  ...getBaseColumns(),
  name: varchar('name').notNull(),
})

export const member = table(
  'group_member',
  {
    groupId: text('group_id')
      .notNull()
      .references(() => group.id, CASCADE_ON_DELETE),
    userId: getUserIdColumn('user_id', false),
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
    groupId: text('group_id')
      .notNull()
      .references(() => group.id, CASCADE_ON_DELETE),
    amount: integer('amount').notNull(),
    note: text('note'),
  },
  (t) => ({
    groupIndex: index().on(t.groupId),
    userIndex: index().on(t.createdBy),
  }),
)

export const notification = table(
  'notification',
  {
    ...getBaseColumns(),
    type: varchar('type').notNull().$type<'group_spend_add' | 'group_member_add'>(),
    read: boolean('read').default(false),
    resourceId: text('resource_id'),
    /** The user who receives the notification */
    userId: getUserIdColumn('user_id', false),
  },
  (t) => ({
    userIndex: index().on(t.userId, t.createdAt).desc(),
  }),
)
