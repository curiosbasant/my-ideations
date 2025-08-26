import { seed } from 'drizzle-seed'

import { db } from './client'
import * as schema from './schema'

async function main() {
  await seed(db, schema)
}

main()
