import { TRPCError } from '@trpc/server'

import type { PgAsyncDatabase } from '@my/db'
import type { JwtPayload } from '@my/lib/supabase'

// https://github.com/orgs/supabase/discussions/23224
// Should be secure because we use the access token that is signed, and not the data read directly from the storage
export function rlsCreator<
  TDatabase extends PgAsyncDatabase<any, any, any>,
  TTransaction extends TDatabase['transaction'],
  TJwtPayload extends JwtPayload = JwtPayload,
>(db: TDatabase, jwtPayload?: TJwtPayload | null, admin?: true): TTransaction {
  // @ts-expect-error
  return async (txCallback, ...rest) => {
    const txFn: typeof txCallback = async (tx) => {
      // Supabase exposes auth.uid() and auth.jwt()
      // https://supabase.com/docs/guides/database/postgres/row-level-security#helper-functions
      try {
        if (jwtPayload) {
          await tx.execute(`
            -- auth.jwt()
            select set_config('request.jwt.claims', '${JSON.stringify(jwtPayload)}', TRUE);
            -- auth.uid()
            select set_config('request.jwt.claim.sub', '${jwtPayload.sub ?? ''}', TRUE);
            -- set local role
            ${admin ? '' : `set local role ${jwtPayload.role ?? 'anon'}`};
          `)
        } else {
          await tx.execute(`set local role anon;`)
        }

        return await txCallback(tx)
      } catch (err) {
        console.error(err)
        if (
          err instanceof Error
          && err.cause instanceof Error
          && err.cause.message.startsWith('new row violates row-level security policy for table')
        ) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Permission Denied', cause: err })
        }
        throw err
      } finally {
        const query = `-- reset
          select set_config('request.jwt.claims', '{}', TRUE);
          select set_config('request.jwt.claim.sub', NULL, TRUE);
          reset role;
        `
        await tx.execute(query).catch(() => void 0)
      }
    }
    return await db.transaction(txFn, ...rest)
  }
}
