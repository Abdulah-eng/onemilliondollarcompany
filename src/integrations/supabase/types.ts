export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      coach_offers: {
        Row: {
          coach_id: string
          created_at: string
          customer_id: string
          duration_months: number
          expires_at: string
          id: string
          message_id: string
          price: number
          status: Database["public"]["Enums"]["offer_status"]
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          customer_id: string
          duration_months: number
          expires_at?: string
          id?: string
          message_id: string
          price: number
          status?: Database["public"]["Enums"]["offer_status"]
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          customer_id?: string
          duration_months?: number
          expires_at?: string
          id?: string
          message_id?: string
          price?: number
          status?: Database["public"]["Enums"]["offer_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_offers_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_offers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_offers_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_requests: {
        Row: {
          coach_id: string
          created_at: string
          customer_id: string
          id: string
          message: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          customer_id: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_requests_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          coach_id: string
          created_at: string
          customer_id: string
          id: string
          status: Database["public"]["Enums"]["conversation_status"]
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          customer_id: string
          id?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: Database["public"]["Enums"]["message_type"]
          metadata: Json | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_details: {
        Row: {
          allergies: string[]
          country: string | null
          created_at: string
          dob: string | null
          gender: string | null
          goals: string[]
          height: number | null
          id: string
          injuries: string[]
          meditation_experience: string | null
          training_dislikes: string[]
          training_likes: string[]
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          allergies?: string[]
          country?: string | null
          created_at?: string
          dob?: string | null
          gender?: string | null
          goals?: string[]
          height?: number | null
          id?: string
          injuries?: string[]
          meditation_experience?: string | null
          training_dislikes?: string[]
          training_likes?: string[]
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          allergies?: string[]
          country?: string | null
          created_at?: string
          dob?: string | null
          gender?: string | null
          goals?: string[]
          height?: number | null
          id?: string
          injuries?: string[]
          meditation_experience?: string | null
          training_dislikes?: string[]
          training_likes?: string[]
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certifications: Json | null
          coach_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarding_complete: boolean
          phone: string | null
          plan: string | null
          plan_expiry: string | null
          role: string
          skills: string[] | null
          socials: Json | null
          stripe_customer_id: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          certifications?: Json | null
          coach_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          onboarding_complete?: boolean
          phone?: string | null
          plan?: string | null
          plan_expiry?: string | null
          role?: string
          skills?: string[] | null
          socials?: Json | null
          stripe_customer_id?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          certifications?: Json | null
          coach_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_complete?: boolean
          phone?: string | null
          plan?: string | null
          plan_expiry?: string | null
          role?: string
          skills?: string[] | null
          socials?: Json | null
          stripe_customer_id?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["program_category"]
          coach_id: string
          created_at: string
          description: string
          id: string
          name: string
          plan: Json | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["program_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["program_category"]
          coach_id: string
          created_at?: string
          description: string
          id?: string
          name: string
          plan?: Json | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["program_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["program_category"]
          coach_id?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          plan?: Json | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["program_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_coach_public_profile: {
        Args: { coach_id: string; viewer_id: string }
        Returns: boolean
      }
      current_user_is_coach: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_primary_user_role: {
        Args: { _user_id: string }
        Returns: string
      }
      get_public_coach_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          bio: string
          certifications: Json
          created_at: string
          full_name: string
          id: string
          role: string
          skills: string[]
          socials: Json
          tagline: string
          updated_at: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_coach_customer_relationship: {
        Args: { coach_user_id: string; customer_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "coach" | "customer"
      conversation_status: "active" | "archived"
      message_type: "text" | "offer" | "system"
      offer_status: "pending" | "accepted" | "rejected" | "expired"
      program_category: "fitness" | "nutrition" | "mental health"
      program_status: "active" | "scheduled" | "draft" | "normal"
      request_status: "pending" | "accepted" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "coach", "customer"],
      conversation_status: ["active", "archived"],
      message_type: ["text", "offer", "system"],
      offer_status: ["pending", "accepted", "rejected", "expired"],
      program_category: ["fitness", "nutrition", "mental health"],
      program_status: ["active", "scheduled", "draft", "normal"],
      request_status: ["pending", "accepted", "rejected"],
    },
  },
} as const
