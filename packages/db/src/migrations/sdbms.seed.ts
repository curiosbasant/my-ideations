import { db } from '../client'
import { sd__classStream, sd__session } from '../schema/sdbms'

export default () => {
  return db.transaction(async (tx) => {
    await Promise.all([
      tx
        .insert(sd__session)
        .values([
          { id: 1, name: '2021-22' },
          { id: 2, name: '2022-23' },
          { id: 3, name: '2023-24' },
          { id: 4, name: '2024-25' },
          { id: 5, name: '2025-26' },
        ])
        .onConflictDoNothing(),
      tx
        .insert(sd__classStream)
        .values([
          { id: 1, name: 'Arts' },
          { id: 2, name: 'Commerce' },
          { id: 3, name: 'Science' },
          { id: 4, name: 'Agriculture' },
        ])
        .onConflictDoNothing(),
    ])
  })
}
