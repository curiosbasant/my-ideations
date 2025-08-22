import { sql } from 'drizzle-orm'

import { db } from '../client'
import { buckets, objects } from '../schema/buckets'

const snapfileFilesBucketName = 'sf__files'

const bucketConfigs: (typeof buckets.$inferInsert)[] = [
  { id: snapfileFilesBucketName, name: snapfileFilesBucketName, public: true },
]

const query = sql`
  create policy "Allow any user to upload snapfiles."
  on ${objects}
  as permissive
  for insert
  to public
  with check (${objects.bucketId} = '${sql.raw(snapfileFilesBucketName)}');
`

export default () =>
  db.transaction(async (tx) => {
    await Promise.all([
      tx.insert(buckets).values(bucketConfigs).onConflictDoNothing(),
      tx.execute(query).catch(() => void 0),
    ])
  })
