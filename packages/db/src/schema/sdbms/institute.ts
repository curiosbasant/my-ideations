import { index } from 'drizzle-orm/pg-core'

import { policyAllowAnyoneSelect } from '../../utils/helpers/policy'
import { bigId, withCommonColumns } from '../../utils/pg-column-helpers'
import { address } from '../address'
import { pgTable } from './_helpers'

export const sd__institute = pgTable(
  'institute',
  withCommonColumns((c) => ({
    name: c.varchar().unique().notNull(),
    addressId: bigId.references(() => address.id),
  })),
  (t) => [index().on(t.createdAt.desc()), policyAllowAnyoneSelect],
)
