import { copycat as c } from '@snaplet/copycat'
import { createSeedClient } from '@snaplet/seed'

import { getRandomNumberBetween, slugify } from '@my/lib/utils'

const snaplet = await createSeedClient({
  dryRun: process.env['DRY'] !== '0',
})
await snaplet.$resetDatabase()

// Log when manually seeding is completed!
if (process.env['DRY'] === '0') console.log('Database Seeding Completed!')

process.exit()
