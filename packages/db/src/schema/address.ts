import { index, primaryKey } from 'drizzle-orm/pg-core'
import { sql, type SQL } from 'drizzle-orm/sql'

import { policyAllowAnyoneSelect } from '../utils/helpers/policy'
import { pgTable } from '../utils/helpers/table'
import {
  bigId,
  getDefaultTimezone,
  getProfileRef,
  getTimestampColumns,
} from '../utils/pg-column-helpers'

export const address = pgTable(
  'address',
  (c) => ({
    id: bigId.primaryKey(),
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
  (t) => [index().using('gist', t.geom), policyAllowAnyoneSelect],
)

export const profileAddress = pgTable(
  'profile_has_addresses',
  (c) => ({
    profileId: getProfileRef().notNull(),
    addressId: bigId.references(() => address.id).notNull(),
    type: c.varchar({ enum: ['current-workplace', 'preferred-workplace'] }),
    updatedAt: getDefaultTimezone(),
  }),
  (t) => [
    primaryKey({ columns: [t.profileId, t.addressId] }),
    index().on(t.type, t.updatedAt.desc()),
    policyAllowAnyoneSelect,
  ],
)
