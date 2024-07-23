import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
  shared: {
    VERCEL_URL: z.string().url().optional(),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  server: {
    POSTGRES_URL: z.string().url(),
    SUPABASE_JWT_SECRET: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'],
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    NODE_ENV: process.env['NODE_ENV'],
    PORT: process.env['PORT'],
    POSTGRES_URL: process.env['POSTGRES_URL'],
    SUPABASE_JWT_SECRET: process.env['SUPABASE_JWT_SECRET'],
    VERCEL_URL: process.env['VERCEL_URL'] && `https://${process.env['VERCEL_URL']}`,
  },
  isServer: typeof window === 'undefined',
  skipValidation:
    !!process.env['CI'] ||
    !!process.env['SKIP_ENV_VALIDATION'] ||
    process.env['npm_lifecycle_event'] === 'lint',
  emptyStringAsUndefined: false,
})
