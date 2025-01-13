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
      booking_items: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          item_type: string | null
          name: string | null
          notes: string | null
          options: Json | null
          quantity: number | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          item_type?: string | null
          name?: string | null
          notes?: string | null
          options?: Json | null
          quantity?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          item_type?: string | null
          name?: string | null
          notes?: string | null
          options?: Json | null
          quantity?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_type: string | null
          created_at: string | null
          end_time: string | null
          id: string
          service_provider_id: string | null
          special_requirements: Json | null
          start_time: string | null
          status: string | null
          time_slot_id: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_type?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          service_provider_id?: string | null
          special_requirements?: Json | null
          start_time?: string | null
          status?: string | null
          time_slot_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_type?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          service_provider_id?: string | null
          special_requirements?: Json | null
          start_time?: string | null
          status?: string | null
          time_slot_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          is_bot: boolean | null
          message: string
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          message: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          message?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
      dietary_restrictions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          menu_item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_item_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_items: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          item_id: string
          priority: number | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          item_id: string
          priority?: number | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          item_id?: string
          priority?: number | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          paid_date: string | null
          status: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          paid_date?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          paid_date?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string | null
          id: string
          level: string | null
          points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: string | null
          points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: string | null
          points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      menu_item_dietary_restrictions: {
        Row: {
          dietary_restriction_id: string
          menu_item_id: string
        }
        Insert: {
          dietary_restriction_id: string
          menu_item_id: string
        }
        Update: {
          dietary_restriction_id?: string
          menu_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_dietary_restrictions_dietary_restriction_id_fkey"
            columns: ["dietary_restriction_id"]
            isOneToOne: false
            referencedRelation: "dietary_restrictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_dietary_restrictions_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_recommendations: {
        Row: {
          created_at: string | null
          menu_item_id: string
          recommended_item_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          menu_item_id: string
          recommended_item_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          menu_item_id?: string
          recommended_item_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_recommendations_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_recommendations_recommended_item_id_fkey"
            columns: ["recommended_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_tags: {
        Row: {
          menu_item_id: string
          tag_id: string
        }
        Insert: {
          menu_item_id: string
          tag_id: string
        }
        Update: {
          menu_item_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_tags_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "menu_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_variations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          menu_item_id: string | null
          name: string
          portion_size: string | null
          price: number
          serves: number | null
          spicy_level: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          menu_item_id?: string | null
          name: string
          portion_size?: string | null
          price: number
          serves?: number | null
          spicy_level?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          menu_item_id?: string | null
          name?: string
          portion_size?: string | null
          price?: number
          serves?: number | null
          spicy_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_variations_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
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
          search_vector: unknown | null
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
          search_vector?: unknown | null
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
          search_vector?: unknown | null
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
      menu_tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
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
          estimated_preparation_time: number | null
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
          estimated_preparation_time?: number | null
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
          estimated_preparation_time?: number | null
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
      payment_methods: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          payment_method_id: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          addresses: string[] | null
          avatar_url: string | null
          created_at: string
          dietary_preferences: string[] | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          addresses?: string[] | null
          avatar_url?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          addresses?: string[] | null
          avatar_url?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          code: string | null
          created_at: string | null
          days_of_week: Json | null
          description: string | null
          discount_percentage: number | null
          end_time: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          max_discount: number | null
          min_purchase: number | null
          name: string
          start_time: string | null
          starts_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          days_of_week?: Json | null
          description?: string | null
          discount_percentage?: number | null
          end_time?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_purchase?: number | null
          name: string
          start_time?: string | null
          starts_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          days_of_week?: Json | null
          description?: string | null
          discount_percentage?: number | null
          end_time?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_purchase?: number | null
          name?: string
          start_time?: string | null
          starts_at?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          menu_item_id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          menu_item_id: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          menu_item_id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
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
          search_vector: unknown | null
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
          search_vector?: unknown | null
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
          search_vector?: unknown | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          location: Json | null
          name: string
          phone: string | null
          services_offered: Json | null
          type: string
          updated_at: string | null
          working_hours: Json | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          location?: Json | null
          name: string
          phone?: string | null
          services_offered?: Json | null
          type: string
          updated_at?: string | null
          working_hours?: Json | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          location?: Json | null
          name?: string
          phone?: string | null
          services_offered?: Json | null
          type?: string
          updated_at?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          capacity: number | null
          created_at: string | null
          end_time: string | null
          id: string
          is_available: boolean | null
          service_provider_id: string | null
          start_time: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          is_available?: boolean | null
          service_provider_id?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          is_available?: boolean | null
          service_provider_id?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_points: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          location: Json | null
          recorded_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          location?: Json | null
          recorded_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          location?: Json | null
          recorded_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_points_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          reference_number: string | null
          status: string | null
          type: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_number?: string | null
          status?: string | null
          type: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_number?: string | null
          status?: string | null
          type?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
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
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
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
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role:
        | "superadmin"
        | "admin"
        | "restaurant"
        | "delivery"
        | "service_provider"
        | "user"
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
