import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const cacheFilePath = path.join(import.meta.dirname, '../node_modules/.cache/migration.json')
const migrationsFolder = path.join(import.meta.dirname, 'migrations')

await runMigrations()
process.exit(0)

type CacheEntry = {
  hash: string
  timestamp: string
}

type CacheEntryRecord = Record<string, CacheEntry>

async function runMigrations() {
  const [fileHashCache, fileNames] = await Promise.all([
    getFileHashCache(),
    readdir(migrationsFolder),
  ])
  const fileHashMap = new Map<string, CacheEntry>()
  const timestamp = new Date().toJSON()

  const processFile = async (fileName: string) => {
    const fileHash = await getFileHash(fileName)

    // Check for cache hit
    if (fileHash === fileHashCache[fileName]?.hash) {
      fileHashMap.set(fileName, fileHashCache[fileName])
      return `🎯 ${fileName}`
    }

    try {
      await executeFile(fileName)
      fileHashMap.set(fileName, { hash: fileHash, timestamp })
      return `✅ ${fileName}`
    } catch (error) {
      console.log(error)
      return `❌ ${fileName}`
    }
  }

  const result = await Promise.all(fileNames.map(processFile))
  console.log(result.join('\n'))

  await saveFileHashCache(Object.fromEntries(fileHashMap))
  console.log('\n👍 Migration finished!')
}

async function getFileHashCache() {
  // ensure directory existence
  await mkdir(path.dirname(cacheFilePath), { recursive: true })

  try {
    const fileContent = await readFile(cacheFilePath, 'utf-8')
    return JSON.parse(fileContent) as CacheEntryRecord
  } catch {
    return {}
  }
}

async function getFileHash(fileName: string) {
  const filePath = path.join(migrationsFolder, fileName)
  return readFile(filePath, 'utf-8').then(generateHash)
}

async function executeFile(fileName: string) {
  const migration = await import(`./migrations/${fileName}`)
  if (typeof migration.default !== 'function') {
    throw new Error(`File: ${fileName}, No default export!`)
  }
  await migration.default()
}

function saveFileHashCache(fileHashCache: CacheEntryRecord) {
  return writeFile(cacheFilePath, JSON.stringify(fileHashCache, null, 2), 'utf8')
}

function generateHash(content: string) {
  return createHash('md5').update(content).digest('hex')
}
