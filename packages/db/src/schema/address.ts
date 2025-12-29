import { index, primaryKey } from 'drizzle-orm/pg-core'
import { sql, type SQL } from 'drizzle-orm/sql'

import {
  getDefaultTimezone,
  getProfileRef,
  getTimestampColumns,
  id,
} from '../utils/pg-column-helpers'
import { pgTable, selectOnlyPolicy } from '../utils/pg-table-helpers'

export const address = pgTable(
  'address',
  (c) => ({
    id: id.primaryKey(),
    text: c.text().notNull(),
    secondaryText: c.text(),
    latitude: c.doublePrecision(),
    longitude: c.doublePrecision(),
    geom: c
      .geometry({ type: 'point', srid: 4326 })
      .generatedAlwaysAs(
        (): SQL => sql`ST_SetSRID(ST_MakePoint(${address.longitude}, ${address.latitude}), 4326)`,
      ),
    placeId: c.text().unique(),
    ...getTimestampColumns(),
  }),
  (t) => [index().using('gist', t.geom), selectOnlyPolicy],
)

export const profileAddress = pgTable(
  'profile_has_addresses',
  (c) => ({
    profileId: getProfileRef().notNull(),
    addressId: id.references(() => address.id).notNull(),
    type: c.varchar({ enum: ['current-workplace', 'preferred-workplace'] }),
    updatedAt: getDefaultTimezone(),
  }),
  (t) => [
    primaryKey({ columns: [t.profileId, t.addressId] }),
    index().on(t.type, t.updatedAt.desc()),
    selectOnlyPolicy,
  ],
)
