import { index, pgTableCreator, primaryKey } from 'drizzle-orm/pg-core'

import {
  getDefaultTimezone,
  getProfileRef,
  id,
  withCommonColumns,
} from '../utils/pg-column-helpers'

const pgTable = pgTableCreator((tableName) => `sb__${tableName}`)

export const sb__group = pgTable(
  'group',
  withCommonColumns((c) => ({
    name: c.varchar().notNull(),
  })),
)

export const sb__member = pgTable(
  'group_member',
  {
    groupId: id.references(() => sb__group.id),
    userId: getProfileRef(),
    joinedAt: getDefaultTimezone(),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] })],
)

export const sb__spend = pgTable(
  'group_spend',
  withCommonColumns((c) => ({
    groupId: id.references(() => sb__group.id).notNull(),
    amount: c.integer().notNull(),
    note: c.text(),
  })),
  (t) => [index().on(t.createdAt.desc(), t.groupId)],
)

export const sb__notification = pgTable(
  'notification',
  withCommonColumns((c) => ({
    type: c.varchar({ enum: ['group_spend_add', 'group_member_join'] }).notNull(),
    read: c.boolean().default(false),
    resourceId: id(),
    /** The user who receives the notification */
    userId: getProfileRef(),
  })),
  (t) => [index().on(t.userId.desc(), t.createdAt)],
)
