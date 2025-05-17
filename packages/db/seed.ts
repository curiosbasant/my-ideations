import { copycat as c } from '@snaplet/copycat'
import { createSeedClient } from '@snaplet/seed'

import { getRandomNumberBetween } from '@my/lib/utils'

import UserIds from './user-ids.json'

const snaplet = await createSeedClient({
  dryRun: process.env['DRY'] !== '0',
})
await snaplet.$resetDatabase(['!*', 'public.*', '!public.profile'])

// await snaplet.users((x) =>
//   x(50, ({ seed }) => ({
//     email: c.email(seed).toLowerCase(),
//     phone: c.phoneNumber(seed, { prefixes: ['91'], length: 12 }),
//     raw_user_meta_data: {
//       username: c
//         .username(seed, { limit: 32 })
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, '_'),
//       full_name: c.fullName(seed),
//       // avatar_url: `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${c.int(seed, { max: 1249 })}.jpg`,
//     },
//     aud: 'authenticated',
//     role: 'authenticated',
//   })),
// )
// snaplet.$store.profile = [
//   // @ts-expect-error - We only want the `id` for relationship
//   // ...snaplet.$store.users.map((user) => ({ id: user.id })),
//   // @ts-expect-error
//   { id: 'b3738a48-54e0-4395-a3cb-2c27af9c0f9f' },
// ]

const connect = { connect: true as const }

await snaplet.sb__group(
  (x) =>
    x(16, {
      sb__group_member: (x) => x(getRandomNumberBetween(8)),
      sb__group_spend: (x) => x(getRandomNumberBetween(2, 50)),
    }),
  {
    connect: {
      profile: UserIds.slice(0, 10),
    },
  },
)

// Log when manually seeding is completed!
if (process.env['DRY'] === '0') console.log('Database Seeding Completed!')

process.exit()

/*
snaplet.profile_role(
  (x) =>
    x(10, ({ seed, index }) => ({
      position: (index + 1) * 1_00_000,
      permissions: c.int(seed, { max: 1 << 25 }).toString(),
      mentionable: c.bool(seed + 'mentionable'),
      visible: c.bool(seed + 'visible'),
      color: '#' + c.int(seed, { max: 0xffffff }).toString(16),

      profiles_has_roles: (x) => x(getRandomNumberBetween(5)),
    })),
  connect,
),
*/
