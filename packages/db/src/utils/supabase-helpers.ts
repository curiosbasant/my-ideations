import { pgSchema } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

const storageSchema = pgSchema('storage')

export const buckets = storageSchema.table('buckets', (c) => ({
  id: c.text().primaryKey(),
  name: c.text().notNull().unique(),
  createdAt: c.timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: c.timestamp({ withTimezone: true }).defaultNow(),
  public: c.boolean().default(false),
  fileSizeLimit: c.bigint({ mode: 'number' }),
  allowedMimeTypes: c.text().array(),
  ownerId: c.text(),
}))

export const objects = storageSchema.table('objects', (c) => ({
  id: c.uuid().primaryKey().defaultRandom(),
  bucketId: c.text('bucket_id').references(() => buckets.id),
  name: c.text(),
  owner: c.uuid(),
  pathTokens: c
    .text()
    .array()
    .generatedAlwaysAs(() => sql`string_to_array(name, '/'::text)`),
  createdAt: c.timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: c.timestamp({ withTimezone: true }).defaultNow(),
  lastAccessedAt: c.timestamp({ withTimezone: true }).defaultNow(),
  metadata: c.jsonb(),
  version: c.text(),
  ownerId: c.text(),
  userMetadata: c.jsonb(),
}))

export const bucketNames = {
  documents: '__documents',
  snapfileFiles: 'sf__files',
}
