import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

if (!process.env['POSTGRES_URL']) throw new Error('Required PostgreSQL connection url.')

declare global {
  var pgClient: undefined | postgres.Sql
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client =
  globalThis.pgClient ?? postgres(process.env['POSTGRES_URL']!, { prepare: false })
if (process.env['NODE_ENV'] !== 'production') globalThis.pgClient = client
export const db = drizzle(client, { schema })

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
export type Database = PostgresJsDatabase<typeof schema>
