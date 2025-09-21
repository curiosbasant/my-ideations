import { index, primaryKey } from 'drizzle-orm/pg-core'
import { SQL, sql } from 'drizzle-orm/sql'

import { __table, selectOnlyPolicy } from './_shared'
import { getBaseColumns, getTimestampColumns } from './base'

export const address = __table(
  'address',
  (c) => ({
    ...getTimestampColumns(),
    id: c.text().primaryKey(),
    text: c.text().notNull(),
    secondaryText: c.text(),
    latitude: c.doublePrecision(),
    longitude: c.doublePrecision(),
    geom: c
      .geometry({ type: 'point', srid: 4326 })
      .generatedAlwaysAs(
        (): SQL => sql`ST_SetSRID(ST_MakePoint(${address.longitude}, ${address.latitude}), 4326)`,
      ),
  }),
  (t) => [index().using('gist', t.geom), selectOnlyPolicy],
)

export const profileAddress = __table(
  'profile_has_addresses',
  (c) => {
    const { createdBy, createdAt } = getBaseColumns()
    return {
      profileId: createdBy,
      addressId: c
        .text()
        .references(() => address.id)
        .notNull(),
      type: c.varchar({ enum: ['current-workplace', 'preferred-workplace'] }),
      updatedAt: createdAt,
    }
  },
  (t) => [
    primaryKey({ columns: [t.profileId, t.addressId] }),
    index().on(t.type),
    index().on(t.updatedAt.desc()),
    selectOnlyPolicy,
  ],
)
