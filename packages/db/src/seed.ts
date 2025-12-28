import { reset, seed } from 'drizzle-seed'

import { db } from './client'
import * as schema from './schema'

async function main() {
  const { profile, address, profileAddress } = schema
  const sch = { address, profileAddress }
  console.log('🧹 Resetting database...')
  await reset(db, sch)

  console.log('🌱 Seeding database...')
  // const userIds = [
  //   'aa18b9ea-b670-459e-a9ec-2a98b4c51982',
  //   '5df09f81-ce92-4735-8beb-d774a16e2040',
  //   'f83e8047-9d74-402f-8c54-78b60c1e6c5c',
  // ]
  const profileIds = await db
    .select({ id: schema.profile.id })
    .from(schema.profile)
    .then((r) => r.map((i) => i.id))
  console.log({ profileIds })

  await seed(db, sch).refine((f) => {
    const profileIdSeed = f.valuesFromArray({ values: profileIds })

    return {
      // profile: {
      //   count: userIds.length,
      //   columns: {
      //     postId: f.default({ defaultValue: null }),
      //     createdBy: f.valuesFromArray({
      //       values: userIds,
      //     }),
      //   },
      // },
      address: {
        count: 500,
        columns: {
          latitude: f.number({
            minValue: 23.05,
            maxValue: 30.2,
            precision: 1000000000,
          }),
          longitude: f.number({
            minValue: 69.5,
            maxValue: 78.2833,
            precision: 1000000000,
          }),
        },
      },
      profileAddress: {
        count: 100,
        columns: {
          profileId: profileIdSeed,
          type: f.weightedRandom([
            { weight: 0.1, value: f.default({ defaultValue: 'current-workplace' }) },
            { weight: 0.9, value: f.default({ defaultValue: 'preferred-workplace' }) },
          ]),
        },
        // with: {
        //   address: 30,
        //   profile: 3,
        // },
      },
    }
  })
}

await main()
console.log('✅ Seed Complete!')
process.exit(0)
