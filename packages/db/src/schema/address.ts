import { index, pgPolicy, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { SQL, sql } from 'drizzle-orm/sql'

import { getBaseColumns, getTimestampColumns } from './base'

const selectOnlyPolicy = pgPolicy('allow_select_to_all', {
  for: 'select',
  withCheck: sql`true`,
})

export const address = pgTable(
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

export const profileAddress = pgTable(
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
