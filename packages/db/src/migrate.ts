import { readdir } from 'node:fs/promises'
import path from 'node:path'

async function runMigrations() {
  const files = await readdir(path.join(import.meta.dirname, 'migrations'))

  for (const file of files) {
    const migration = await import(`./migrations/${file}`)
    if (typeof migration.default === 'function') {
      await migration.default()
      console.log(`Executed migration: ${file}`)
    } else {
      console.warn(`No default export found in ${file}`)
    }
  }
}

await runMigrations()

console.log('All migrations executed successfully!')
process.exit(0)
