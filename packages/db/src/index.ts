import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { client } from './client'
import * as schema from './schema'

export { schema }

export * from 'drizzle-orm'
export { PgDialect } from 'drizzle-orm/pg-core'

export const db = drizzle(client, { schema })
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
export type Database = PostgresJsDatabase<typeof schema>
