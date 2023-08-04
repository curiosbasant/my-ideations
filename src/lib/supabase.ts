import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: true },
  }
)

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      short_url: {
        Row: {
          created_at: string
          id: number
          code: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          code: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          code?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
