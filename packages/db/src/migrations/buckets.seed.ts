import { db } from '../client'
import { bucketNames, buckets } from '../utils/supabase-helpers'

const bucketValues: (typeof buckets.$inferInsert)[] = [
  { id: bucketNames.documents, name: bucketNames.documents },
  { id: bucketNames.snapfileFiles, name: bucketNames.snapfileFiles, public: true },
]

export default () => db.insert(buckets).values(bucketValues).onConflictDoNothing()
