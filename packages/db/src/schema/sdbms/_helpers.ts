import { pgTableCreator } from 'drizzle-orm/pg-core'

export const pgTable = pgTableCreator((tableName) => `sd__${tableName}`)
