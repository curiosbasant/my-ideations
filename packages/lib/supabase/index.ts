import type { AuthError, Session } from '@supabase/supabase-js'

export * from '@supabase/supabase-js'
export * from '@supabase/ssr'
export * from './shared'
export type { Database } from './types.gen'

declare module '@supabase/auth-js' {
  interface GoTrueClient {
    getSession(): Promise<
      | { data: { session: Session | null }; error: null }
      | { data: { session: null }; error: AuthError }
    >
  }
}
