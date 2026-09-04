import { pgTableCreator } from 'drizzle-orm/pg-core'

export const pgTable = pgTableCreator((tableName) => `__${tableName}`, 'snake_case')
