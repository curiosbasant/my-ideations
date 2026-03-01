import { index } from 'drizzle-orm/pg-core'

import { policyAllowAnyoneSelect } from '../../utils/helpers/policy'
import { id, withCommonColumns } from '../../utils/pg-column-helpers'
import { address } from '../address'
import { pgTable } from './_helpers'

export const sd__institute = pgTable(
  'institute',
  withCommonColumns((c) => ({
    name: c.varchar().unique().notNull(),
    addressId: id.references(() => address.id),
  })),
  (t) => [index().on(t.createdAt.desc()), policyAllowAnyoneSelect],
)
