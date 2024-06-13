import { supabase } from '~/lib/supabase'

export const auth = supabase.auth
export { type AuthError, type Session } from '~/lib/supabase'
