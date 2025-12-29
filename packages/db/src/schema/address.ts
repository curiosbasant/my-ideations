import { index, primaryKey } from 'drizzle-orm/pg-core'
import { SQL, sql } from 'drizzle-orm/sql'

import {
  getBaseColumns,
  getPrimaryColumn,
  getTimestampColumns,
  takeForeignId,
} from '../utils/pg-column-helpers'
import { pgTable, selectOnlyPolicy } from '../utils/pg-table-helpers'

export const address = pgTable(
  'address',
  (c) => ({
    id: getPrimaryColumn(),
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
  (c) => {
    const { createdBy, createdAt } = getBaseColumns()
    return {
      profileId: createdBy,
      addressId: takeForeignId(() => address.id).notNull(),
      type: c.varchar({ enum: ['current-workplace', 'preferred-workplace'] }),
      updatedAt: createdAt,
    }
  },
  (t) => [
    primaryKey({ columns: [t.profileId, t.addressId] }),
    index().on(t.type, t.updatedAt.desc()),
    selectOnlyPolicy,
  ],
)
