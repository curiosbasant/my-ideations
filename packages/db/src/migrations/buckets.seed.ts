import { sql } from 'drizzle-orm'

import { db } from '../client'
import { buckets, objects } from '../utils/supabase-helpers'

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
  Promise.all([
    db.insert(buckets).values(bucketConfigs).onConflictDoNothing(),
    db.execute(query).catch(() => void 0),
  ])
