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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          affiliate_url: string
          clicked_at: string
          id: string
          ip_address: string | null
          product_id: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          affiliate_url: string
          clicked_at?: string
          id?: string
          ip_address?: string | null
          product_id: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          affiliate_url?: string
          clicked_at?: string
          id?: string
          ip_address?: string | null
          product_id?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      outfit_generations: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      photo_analyses: {
        Row: {
          analyzed_at: string | null
          avoid_colors: Json | null
          body_type: string | null
          created_at: string
          hair_color: string | null
          id: string
          measurements: Json | null
          photo_id: string
          photo_url: string
          recommended_colors: Json | null
          skin_tone: string | null
          user_id: string | null
        }
        Insert: {
          analyzed_at?: string | null
          avoid_colors?: Json | null
          body_type?: string | null
          created_at?: string
          hair_color?: string | null
          id?: string
          measurements?: Json | null
          photo_id: string
          photo_url: string
          recommended_colors?: Json | null
          skin_tone?: string | null
          user_id?: string | null
        }
        Update: {
          analyzed_at?: string | null
          avoid_colors?: Json | null
          body_type?: string | null
          created_at?: string
          hair_color?: string | null
          id?: string
          measurements?: Json | null
          photo_id?: string
          photo_url?: string
          recommended_colors?: Json | null
          skin_tone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      premium_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          tier: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          tier?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          tier?: string
        }
        Relationships: []
      }
      products_catalog: {
        Row: {
          affiliate_url: string
          body_types: Json | null
          brand: string | null
          category: string | null
          color: string | null
          created_at: string
          discounted_price: number | null
          id: string
          image_url: string | null
          name: string
          occasion: Json | null
          price: number
          product_id: string
          rating: number | null
          store: string | null
        }
        Insert: {
          affiliate_url: string
          body_types?: Json | null
          brand?: string | null
          category?: string | null
          color?: string | null
          created_at?: string
          discounted_price?: number | null
          id?: string
          image_url?: string | null
          name: string
          occasion?: Json | null
          price: number
          product_id: string
          rating?: number | null
          store?: string | null
        }
        Update: {
          affiliate_url?: string
          body_types?: Json | null
          brand?: string | null
          category?: string | null
          color?: string | null
          created_at?: string
          discounted_price?: number | null
          id?: string
          image_url?: string | null
          name?: string
          occasion?: Json | null
          price?: number
          product_id?: string
          rating?: number | null
          store?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          product_brand: string | null
          product_category: string | null
          product_color: string | null
          product_discounted_price: number | null
          product_id: string
          product_image_url: string | null
          product_name: string
          product_price: number | null
          product_store: string | null
          product_store_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_brand?: string | null
          product_category?: string | null
          product_color?: string | null
          product_discounted_price?: number | null
          product_id: string
          product_image_url?: string | null
          product_name: string
          product_price?: number | null
          product_store?: string | null
          product_store_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_brand?: string | null
          product_category?: string | null
          product_color?: string | null
          product_discounted_price?: number | null
          product_id?: string
          product_image_url?: string | null
          product_name?: string
          product_price?: number | null
          product_store?: string | null
          product_store_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_outfits: {
        Row: {
          created_at: string
          id: string
          outfit_color_palette: Json | null
          outfit_description: string | null
          outfit_discounted_price: number | null
          outfit_id: string
          outfit_name: string
          outfit_occasion: Json | null
          outfit_products: Json
          outfit_total_price: number | null
          outfit_why_it_suits: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          outfit_color_palette?: Json | null
          outfit_description?: string | null
          outfit_discounted_price?: number | null
          outfit_id: string
          outfit_name: string
          outfit_occasion?: Json | null
          outfit_products: Json
          outfit_total_price?: number | null
          outfit_why_it_suits?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          outfit_color_palette?: Json | null
          outfit_description?: string | null
          outfit_discounted_price?: number | null
          outfit_id?: string
          outfit_name?: string
          outfit_occasion?: Json | null
          outfit_products?: Json
          outfit_total_price?: number | null
          outfit_why_it_suits?: string | null
          user_id?: string
        }
        Relationships: []
      }
      style_reports: {
        Row: {
          created_at: string
          id: string
          quiz_inputs: Json | null
          report_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_inputs?: Json | null
          report_data: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quiz_inputs?: Json | null
          report_data?: Json
          user_id?: string
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
    Enums: {},
  },
} as const
