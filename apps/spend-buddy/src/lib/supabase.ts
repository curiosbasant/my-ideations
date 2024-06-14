import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase needs both url and anon key to function properly.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export async function withThrowOnError<T>(
  promise: Promise<{ data: T; error: null } | { data: unknown; error: Error }>,
): Promise<T> {
  const { data, error } = await promise
  if (error) throw error
  return data
}

export type * from '@supabase/supabase-js'
