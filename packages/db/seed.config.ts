import { SeedPostgres } from '@snaplet/seed/adapter-postgres'
import { defineConfig } from '@snaplet/seed/config'

import { client } from './src/client'

export default defineConfig({
  adapter: () => new SeedPostgres(client),
})
