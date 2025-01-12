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
      delivery_drivers: {
        Row: {
          average_rating: number | null
          created_at: string | null
          current_latitude: number | null
          current_longitude: number | null
          id: string
          last_location_update: string | null
          status: string | null
          total_deliveries: number | null
          user_id: string | null
        }
        Insert: {
          average_rating?: number | null
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          last_location_update?: string | null
          status?: string | null
          total_deliveries?: number | null
          user_id?: string | null
        }
        Update: {
          average_rating?: number | null
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          last_location_update?: string | null
          status?: string | null
          total_deliveries?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      delivery_tracking: {
        Row: {
          delivered_at: string | null
          delivery_user_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          order_id: string | null
          picked_up_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          delivered_at?: string | null
          delivery_user_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          order_id?: string | null
          picked_up_at?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          delivered_at?: string | null
          delivery_user_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          order_id?: string | null
          picked_up_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          available: boolean | null
          category: string | null
          created_at: string
          cuisine_type: string | null
          customization_options: Json | null
          description: string | null
          dietary_preferences: string[] | null
          id: string
          image_url: string | null
          name: string
          popularity_score: number | null
          price: number
          restaurant_id: string | null
        }
        Insert: {
          available?: boolean | null
          category?: string | null
          created_at?: string
          cuisine_type?: string | null
          customization_options?: Json | null
          description?: string | null
          dietary_preferences?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          popularity_score?: number | null
          price: number
          restaurant_id?: string | null
        }
        Update: {
          available?: boolean | null
          category?: string | null
          created_at?: string
          cuisine_type?: string | null
          customization_options?: Json | null
          description?: string | null
          dietary_preferences?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          popularity_score?: number | null
          price?: number
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          item_name: string
          order_id: string | null
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          item_name: string
          order_id?: string | null
          price: number
          quantity: number
        }
        Update: {
          id?: string
          item_name?: string
          order_id?: string | null
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          accepted_at: string | null
          actual_delivery_time: string | null
          created_at: string
          delivery_address: string
          estimated_delivery_time: string | null
          id: string
          payment_method: string | null
          payment_status: string
          prepared_at: string | null
          rating: number | null
          rating_comment: string | null
          restaurant_comment: string | null
          restaurant_id: string
          restaurant_rating: number | null
          status: string
          tip_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          actual_delivery_time?: string | null
          created_at?: string
          delivery_address: string
          estimated_delivery_time?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          prepared_at?: string | null
          rating?: number | null
          rating_comment?: string | null
          restaurant_comment?: string | null
          restaurant_id: string
          restaurant_rating?: number | null
          status?: string
          tip_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          actual_delivery_time?: string | null
          created_at?: string
          delivery_address?: string
          estimated_delivery_time?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          prepared_at?: string | null
          rating?: number | null
          rating_comment?: string | null
          restaurant_comment?: string | null
          restaurant_id?: string
          restaurant_rating?: number | null
          status?: string
          tip_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string
          created_at: string
          estimated_preparation_time: number | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string
          estimated_preparation_time?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          estimated_preparation_time?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_secret: {
        Args: {
          secret_name: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "restaurant" | "delivery" | "user"
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
