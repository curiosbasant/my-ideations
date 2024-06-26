import type { AuthError, Session } from '@supabase/supabase-js'

export * from '@supabase/supabase-js'

declare module '@supabase/auth-js' {
  interface GoTrueClient {
    getSession(): Promise<
      | { data: { session: Session | null }; error: null }
      | { data: { session: null }; error: AuthError }
    >
  }
}

export async function withThrowOnError<T>(
  promise: Promise<{ data: T; error: null } | { data: unknown; error: Error }>,
): Promise<T> {
  const { data, error } = await promise
  if (error) throw error
  return data
}
