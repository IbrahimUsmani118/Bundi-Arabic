export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      beauty_services: {
        Row: {
          city: string
          created_at: string | null
          duration: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          provider: string
          rating: number | null
          service_type: string
        }
        Insert: {
          city?: string
          created_at?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          provider: string
          rating?: number | null
          service_type?: string
        }
        Update: {
          city?: string
          created_at?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          provider?: string
          rating?: number | null
          service_type?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          city: string
          created_at: string | null
          date: string
          id: string
          image_url: string | null
          location: string
          price: number | null
          rating: number | null
          title: string
          type: string
        }
        Insert: {
          city?: string
          created_at?: string | null
          date: string
          id?: string
          image_url?: string | null
          location: string
          price?: number | null
          rating?: number | null
          title: string
          type: string
        }
        Update: {
          city?: string
          created_at?: string | null
          date?: string
          id?: string
          image_url?: string | null
          location?: string
          price?: number | null
          rating?: number | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      flights: {
        Row: {
          airline: string
          arrival_city: string
          arrival_time: string
          created_at: string | null
          departure_city: string
          departure_time: string
          flight_number: string
          id: string
          price: number | null
          seat_type: string
        }
        Insert: {
          airline: string
          arrival_city: string
          arrival_time: string
          created_at?: string | null
          departure_city: string
          departure_time: string
          flight_number: string
          id?: string
          price?: number | null
          seat_type?: string
        }
        Update: {
          airline?: string
          arrival_city?: string
          arrival_time?: string
          created_at?: string | null
          departure_city?: string
          departure_time?: string
          flight_number?: string
          id?: string
          price?: number | null
          seat_type?: string
        }
        Relationships: []
      }
      rentals: {
        Row: {
          available: boolean | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          price_per_day: number | null
          rating: number | null
          store_location: string
          type: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          price_per_day?: number | null
          rating?: number | null
          store_location?: string
          type: string
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price_per_day?: number | null
          rating?: number | null
          store_location?: string
          type?: string
        }
        Relationships: []
      }
      resorts: {
        Row: {
          amenities: string[] | null
          created_at: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          price_per_night: number | null
          rating: number | null
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          price_per_night?: number | null
          rating?: number | null
        }
        Update: {
          amenities?: string[] | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          price_per_night?: number | null
          rating?: number | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
