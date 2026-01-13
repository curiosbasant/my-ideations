import { PgDatabase } from 'drizzle-orm/pg-core'

import type { JwtPayload } from '@my/lib/supabase'

// https://github.com/orgs/supabase/discussions/23224
// Should be secure because we use the access token that is signed, and not the data read directly from the storage
export function rlsCreator<
  Database extends PgDatabase<any, any, any>,
  Token extends JwtPayload = JwtPayload,
>(db: Database, jwtPayload: Token): typeof db.transaction {
  return async (txCallback, ...rest) => {
    const txFn: typeof txCallback = async (tx) => {
      // Supabase exposes auth.uid() and auth.jwt()
      // https://supabase.com/docs/guides/database/postgres/row-level-security#helper-functions
      try {
        await tx.execute(`
          -- auth.jwt()
          select set_config('request.jwt.claims', '${JSON.stringify(jwtPayload)}', TRUE);
          -- auth.uid()
          select set_config('request.jwt.claim.sub', '${jwtPayload.sub ?? ''}', TRUE);
          -- set local role
          set local role ${jwtPayload.role ?? 'anon'};
        `)
        return await txCallback(tx)
      } finally {
        await tx.execute(`
          -- reset
          select set_config('request.jwt.claims', NULL, TRUE);
          select set_config('request.jwt.claim.sub', NULL, TRUE);
          reset role;
        `)
      }
    }
    return await db.transaction(txFn, ...rest)
  }
}
