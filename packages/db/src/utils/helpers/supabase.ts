import { pgSchema } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

export const authSchema = pgSchema('auth')

export const authUser = authSchema.table('users', (c) => ({
  instanceId: c.uuid(),
  id: c.uuid().primaryKey().notNull(),
  aud: c.varchar({ length: 255 }),
  role: c.varchar({ length: 255 }),
  email: c.varchar({ length: 255 }),
  encryptedPassword: c.varchar({ length: 255 }),
  emailConfirmedAt: c.timestamp({ withTimezone: true }),
  invitedAt: c.timestamp({ withTimezone: true }),
  confirmationToken: c.varchar({ length: 255 }),
  confirmationSentAt: c.timestamp({ withTimezone: true }),
  recoveryToken: c.varchar({ length: 255 }),
  recoverySentAt: c.timestamp({ withTimezone: true }),
  emailChangeTokenNew: c.varchar({ length: 255 }),
  emailChange: c.varchar({ length: 255 }),
  emailChangeSentAt: c.timestamp({ withTimezone: true }),
  lastSignInAt: c.timestamp({ withTimezone: true }),
  rawAppMetaData: c.jsonb(),
  rawUserMetaData: c.jsonb(),
  isSuperAdmin: c.boolean(),
  createdAt: c.timestamp({ withTimezone: true }),
  updatedAt: c.timestamp({ withTimezone: true }),
  phone: c.text().unique(),
  phoneConfirmedAt: c.timestamp({ withTimezone: true }),
  phoneChange: c.text().default(''),
  phoneChangeToken: c.varchar({ length: 255 }).default(''),
  phoneChangeSentAt: c.timestamp({ withTimezone: true }),
  confirmedAt: c
    .timestamp({ withTimezone: true })
    .generatedAlwaysAs(sql`least(email_confirmed_at, phone_confirmed_at)`),
  emailChangeTokenCurrent: c.varchar({ length: 255 }).default(''),
  emailChangeConfirmStatus: c.smallint().default(0),
  bannedUntil: c.timestamp({ withTimezone: true }),
  reauthenticationToken: c.varchar({ length: 255 }).default(''),
  reauthenticationSentAt: c.timestamp({ withTimezone: true }),
  isSsoUser: c.boolean().default(false).notNull(),
  deletedAt: c.timestamp({ withTimezone: true }),
  isAnonymous: c.boolean().default(false).notNull(),
}))

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
