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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          featured_object_id: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          name: string
          object_count: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured_object_id?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name: string
          object_count?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured_object_id?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name?: string
          object_count?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      celestial_objects: {
        Row: {
          age: string | null
          category_id: string | null
          constellation: string | null
          created_at: string
          declination: string | null
          detailed_description: string | null
          discoverer: string | null
          discovery_date: string | null
          discovery_location: string | null
          discovery_story: string | null
          discovery_year: number | null
          distance_light_years: number | null
          featured_date: string | null
          gallery_images: Json | null
          id: string
          is_featured: boolean | null
          mass: string | null
          name: string
          object_type: Database["public"]["Enums"]["celestial_object_type"]
          primary_image_url: string | null
          radius: string | null
          right_ascension: string | null
          scientific_classification: string | null
          short_description: string | null
          slug: string
          temperature: string | null
          thumbnail_url: string | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          age?: string | null
          category_id?: string | null
          constellation?: string | null
          created_at?: string
          declination?: string | null
          detailed_description?: string | null
          discoverer?: string | null
          discovery_date?: string | null
          discovery_location?: string | null
          discovery_story?: string | null
          discovery_year?: number | null
          distance_light_years?: number | null
          featured_date?: string | null
          gallery_images?: Json | null
          id?: string
          is_featured?: boolean | null
          mass?: string | null
          name: string
          object_type: Database["public"]["Enums"]["celestial_object_type"]
          primary_image_url?: string | null
          radius?: string | null
          right_ascension?: string | null
          scientific_classification?: string | null
          short_description?: string | null
          slug: string
          temperature?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          age?: string | null
          category_id?: string | null
          constellation?: string | null
          created_at?: string
          declination?: string | null
          detailed_description?: string | null
          discoverer?: string | null
          discovery_date?: string | null
          discovery_location?: string | null
          discovery_story?: string | null
          discovery_year?: number | null
          distance_light_years?: number | null
          featured_date?: string | null
          gallery_images?: Json | null
          id?: string
          is_featured?: boolean | null
          mass?: string | null
          name?: string
          object_type?: Database["public"]["Enums"]["celestial_object_type"]
          primary_image_url?: string | null
          radius?: string | null
          right_ascension?: string | null
          scientific_classification?: string | null
          short_description?: string | null
          slug?: string
          temperature?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "celestial_objects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_facts: {
        Row: {
          celestial_object_id: string | null
          created_at: string
          custom_description: string | null
          custom_title: string | null
          fact_date: string
          id: string
        }
        Insert: {
          celestial_object_id?: string | null
          created_at?: string
          custom_description?: string | null
          custom_title?: string | null
          fact_date: string
          id?: string
        }
        Update: {
          celestial_object_id?: string | null
          created_at?: string
          custom_description?: string | null
          custom_title?: string | null
          fact_date?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_facts_celestial_object_id_fkey"
            columns: ["celestial_object_id"]
            isOneToOne: false
            referencedRelation: "celestial_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      discoveries: {
        Row: {
          celestial_object_id: string | null
          created_at: string
          description: string | null
          discoverer: string | null
          discovery_date: string
          discovery_year: number
          id: string
          image_url: string | null
          significance: string | null
          source_url: string | null
          title: string
        }
        Insert: {
          celestial_object_id?: string | null
          created_at?: string
          description?: string | null
          discoverer?: string | null
          discovery_date: string
          discovery_year: number
          id?: string
          image_url?: string | null
          significance?: string | null
          source_url?: string | null
          title: string
        }
        Update: {
          celestial_object_id?: string | null
          created_at?: string
          description?: string | null
          discoverer?: string | null
          discovery_date?: string
          discovery_year?: number
          id?: string
          image_url?: string | null
          significance?: string | null
          source_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "discoveries_celestial_object_id_fkey"
            columns: ["celestial_object_id"]
            isOneToOne: false
            referencedRelation: "celestial_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_type: string | null
          event_year: number | null
          id: string
          image_url: string | null
          is_recurring: boolean | null
          recurrence_pattern: string | null
          related_object_id: string | null
          title: string
          visibility_info: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type?: string | null
          event_year?: number | null
          id?: string
          image_url?: string | null
          is_recurring?: boolean | null
          recurrence_pattern?: string | null
          related_object_id?: string | null
          title: string
          visibility_info?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type?: string | null
          event_year?: number | null
          id?: string
          image_url?: string | null
          is_recurring?: boolean | null
          recurrence_pattern?: string | null
          related_object_id?: string | null
          title?: string
          visibility_info?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_related_object_id_fkey"
            columns: ["related_object_id"]
            isOneToOne: false
            referencedRelation: "celestial_objects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      celestial_object_type:
        | "planet"
        | "star"
        | "galaxy"
        | "nebula"
        | "asteroid"
        | "comet"
        | "black_hole"
        | "moon"
        | "exoplanet"
        | "constellation"
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
      celestial_object_type: [
        "planet",
        "star",
        "galaxy",
        "nebula",
        "asteroid",
        "comet",
        "black_hole",
        "moon",
        "exoplanet",
        "constellation",
      ],
    },
  },
} as const
