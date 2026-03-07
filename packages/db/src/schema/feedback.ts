import { index } from 'drizzle-orm/pg-core'

import { CASCADE_ON_UPDATE, smallId, withCommonColumns } from '../utils/helpers/column'
import {
  policyAllowAuthenticatedSelect,
  policyAllowProfileInsertOwn,
} from '../utils/helpers/policy'
import { pgTable } from '../utils/helpers/table'

export const feedback = pgTable(
  'feedback',
  withCommonColumns((c) => ({
    title: c.varchar().notNull(),
    content: c.text(),
    type: smallId.references(() => feedbackType.id, CASCADE_ON_UPDATE),
    rating: c.smallint(),
    page: c.text(),
  })),
  (t) => [index().on(t.createdAt.desc()), policyAllowProfileInsertOwn(t.createdBy)],
)

// ~~~~~~ Lookup Tables ~~~~~~

export const feedbackType = pgTable(
  'feedback_lu_type',
  (c) => ({
    id: smallId().primaryKey(),
    name: c.varchar().unique().notNull(),
  }),
  () => [policyAllowAuthenticatedSelect],
)
