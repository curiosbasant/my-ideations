export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)'
  }
  public: {
    Tables: {
      format__file: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          url?: string
        }
        Relationships: []
      }
      gdb__board: {
        Row: {
          active_player_index: number | null
          boxes: Json | null
          cols: number
          created_at: string
          created_by: number
          dashes: Json | null
          id: number
          players: string[]
          rows: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          active_player_index?: number | null
          boxes?: Json | null
          cols: number
          created_at?: string
          created_by: number
          dashes?: Json | null
          id?: number
          players: string[]
          rows: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          active_player_index?: number | null
          boxes?: Json | null
          cols?: number
          created_at?: string
          created_by?: number
          dashes?: Json | null
          id?: number
          players?: string[]
          rows?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'gdb__board_created_by_profile_id_fk'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      sb__group: {
        Row: {
          created_at: string
          created_by: number
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          created_by: number
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: number
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'sb__group_created_by_profile_id_fk'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      sb__group_member: {
        Row: {
          group_id: number
          joined_at: string
          user_id: number
        }
        Insert: {
          group_id: number
          joined_at?: string
          user_id: number
        }
        Update: {
          group_id?: number
          joined_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'sb__group_member_group_id_sb__group_id_fk'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'sb__group'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sb__group_member_user_id_profile_id_fk'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      sb__group_spend: {
        Row: {
          amount: number
          created_at: string
          created_by: number
          group_id: number
          id: number
          note: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: number
          group_id: number
          id?: number
          note?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: number
          group_id?: number
          id?: number
          note?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'sb__group_spend_created_by_profile_id_fk'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sb__group_spend_group_id_sb__group_id_fk'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'sb__group'
            referencedColumns: ['id']
          },
        ]
      }
      sb__notification: {
        Row: {
          created_at: string
          created_by: number
          id: number
          read: boolean | null
          resource_id: string | null
          type: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          created_by: number
          id?: number
          read?: boolean | null
          resource_id?: string | null
          type: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          created_by?: number
          id?: number
          read?: boolean | null
          resource_id?: string | null
          type?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'sb__notification_created_by_profile_id_fk'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sb__notification_user_id_profile_id_fk'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      sf__short_url: {
        Row: {
          code: string
          created_at: string
          id: number
          url: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          url: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
  : never = never,
> =
  DefaultSchemaTableNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends (
      {
        Row: infer R
      }
    ) ?
      R
    : never
  : DefaultSchemaTableNameOrOptions extends (
    keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  ) ?
    (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends (
      {
        Row: infer R
      }
    ) ?
      R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
  : never = never,
> =
  DefaultSchemaTableNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends (
      {
        Insert: infer I
      }
    ) ?
      I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] ?
    DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends (
      {
        Insert: infer I
      }
    ) ?
      I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
  : never = never,
> =
  DefaultSchemaTableNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends (
      {
        Update: infer U
      }
    ) ?
      U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] ?
    DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends (
      {
        Update: infer U
      }
    ) ?
      U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
  : never = never,
> =
  DefaultSchemaEnumNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] ?
    DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
  : never = never,
> =
  PublicCompositeTypeNameOrOptions extends (
    {
      schema: keyof DatabaseWithoutInternals
    }
  ) ?
    DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] ?
    DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
