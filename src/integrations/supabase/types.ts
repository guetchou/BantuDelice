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
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_drivers: {
        Row: {
          average_rating: number | null
          commission_rate: number | null
          created_at: string | null
          current_latitude: number | null
          current_longitude: number | null
          id: string
          last_location_update: string | null
          status: string | null
          total_deliveries: number | null
          total_earnings: number | null
          user_id: string | null
        }
        Insert: {
          average_rating?: number | null
          commission_rate?: number | null
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          last_location_update?: string | null
          status?: string | null
          total_deliveries?: number | null
          total_earnings?: number | null
          user_id?: string | null
        }
        Update: {
          average_rating?: number | null
          commission_rate?: number | null
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          last_location_update?: string | null
          status?: string | null
          total_deliveries?: number | null
          total_earnings?: number | null
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
      driver_earnings: {
        Row: {
          amount: number
          commission_amount: number
          driver_id: string | null
          earned_at: string | null
          id: string
          ride_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          commission_amount: number
          driver_id?: string | null
          earned_at?: string | null
          id?: string
          ride_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          commission_amount?: number
          driver_id?: string | null
          earned_at?: string | null
          id?: string
          ride_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_earnings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "delivery_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_earnings_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "taxi_rides"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          driver_id: string
          id: string
          order_id: string | null
          paid_at: string | null
          payment_method: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          driver_id: string
          id?: string
          order_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          driver_id?: string
          id?: string
          order_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_payments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "delivery_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
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
      inventory_levels: {
        Row: {
          created_at: string | null
          current_stock: number
          id: string
          last_restock_date: string | null
          menu_item_id: string | null
          min_stock_level: number
          next_restock_date: string | null
          reserved_stock: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_stock?: number
          id?: string
          last_restock_date?: string | null
          menu_item_id?: string | null
          min_stock_level?: number
          next_restock_date?: string | null
          reserved_stock?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_stock?: number
          id?: string
          last_restock_date?: string | null
          menu_item_id?: string | null
          min_stock_level?: number
          next_restock_date?: string | null
          reserved_stock?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_levels_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
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
          benefits: Json | null
          created_at: string | null
          id: string
          level: string | null
          points: number | null
          points_to_next_tier: number | null
          tier_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          id?: string
          level?: string | null
          points?: number | null
          points_to_next_tier?: number | null
          tier_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          id?: string
          level?: string | null
          points?: number | null
          points_to_next_tier?: number | null
          tier_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          points_cost: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points_cost: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_cost?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_rewards_history: {
        Row: {
          id: string
          points_spent: number
          redeemed_at: string | null
          reward_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          points_spent: number
          redeemed_at?: string | null
          reward_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          points_spent?: number
          redeemed_at?: string | null
          reward_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_rewards_history_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rewards"
            referencedColumns: ["id"]
          },
        ]
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
          name: string
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
      notification_preferences: {
        Row: {
          booking_reminders: boolean | null
          created_at: string | null
          order_updates: boolean | null
          promotional_emails: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_reminders?: boolean | null
          created_at?: string | null
          order_updates?: boolean | null
          promotional_emails?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_reminders?: boolean | null
          created_at?: string | null
          order_updates?: boolean | null
          promotional_emails?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_type: string | null
          created_at: string
          id: string
          link: string | null
          message: string
          metadata: Json | null
          read: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          read?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          action_type?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
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
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          delivery_address: string
          delivery_instructions: string | null
          delivery_status: string | null
          delivery_time_preference: string | null
          estimated_delivery_time: string | null
          estimated_preparation_time: number | null
          id: string
          loyalty_points_earned: number | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          prepared_at: string | null
          rating: number | null
          rating_comment: string | null
          restaurant_comment: string | null
          restaurant_id: string
          restaurant_rating: number | null
          special_requests: Json | null
          status: string
          stock_validated: boolean | null
          tip_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          actual_delivery_time?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at: string
          delivery_address: string
          delivery_instructions?: string | null
          delivery_status?: string | null
          delivery_time_preference?: string | null
          estimated_delivery_time?: string | null
          estimated_preparation_time?: number | null
          id?: string
          loyalty_points_earned?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status: string
          prepared_at?: string | null
          rating?: number | null
          rating_comment?: string | null
          restaurant_comment?: string | null
          restaurant_id: string
          restaurant_rating?: number | null
          special_requests?: Json | null
          status?: string
          stock_validated?: boolean | null
          tip_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          actual_delivery_time?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          delivery_address?: string
          delivery_instructions?: string | null
          delivery_status?: string | null
          delivery_time_preference?: string | null
          estimated_delivery_time?: string | null
          estimated_preparation_time?: number | null
          id?: string
          loyalty_points_earned?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          prepared_at?: string | null
          rating?: number | null
          rating_comment?: string | null
          restaurant_comment?: string | null
          restaurant_id: string
          restaurant_rating?: number | null
          special_requests?: Json | null
          status?: string
          stock_validated?: boolean | null
          tip_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string
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
          created_at: string
          dietary_preferences?: string[] | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at: string
        }
        Update: {
          addresses?: string[] | null
          avatar_url?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at: string
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
      restaurant_analytics: {
        Row: {
          average_preparation_time: number | null
          cancelled_orders: number | null
          created_at: string | null
          date: string
          id: string
          peak_hours: Json | null
          popular_items: Json | null
          restaurant_id: string
          total_orders: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          average_preparation_time?: number | null
          cancelled_orders?: number | null
          created_at?: string | null
          date: string
          id: string
          peak_hours?: Json | null
          popular_items?: Json | null
          restaurant_id: string
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          average_preparation_time?: number | null
          cancelled_orders?: number | null
          created_at?: string | null
          date?: string
          id?: string
          peak_hours?: Json | null
          popular_items?: Json | null
          restaurant_id: string
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_analytics_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string
          created_at: string
          cuisine_type: string | null
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
          cuisine_type?: string | null
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
          cuisine_type?: string | null
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
          id: string
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
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      taxi_rides: {
        Row: {
          actual_price: number | null
          created_at: string | null
          destination_address: string
          destination_latitude: number | null
          destination_longitude: number | null
          driver_id: string | null
          estimated_price: number | null
          id: string
          payment_method: string | null
          payment_status: string | null
          pickup_address: string
          pickup_latitude: number | null
          pickup_longitude: number | null
          pickup_time: string
          rating: number | null
          rating_comment: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          vehicle_type: string | null
        }
        Insert: {
          actual_price?: number | null
          created_at?: string | null
          destination_address: string
          destination_latitude?: number | null
          destination_longitude?: number | null
          driver_id?: string | null
          estimated_price?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          pickup_address: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          pickup_time: string
          rating?: number | null
          rating_comment?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_type?: string | null
        }
        Update: {
          actual_price?: number | null
          created_at?: string | null
          destination_address?: string
          destination_latitude?: number | null
          destination_longitude?: number | null
          driver_id?: string | null
          estimated_price?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          pickup_address?: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          pickup_time?: string
          rating?: number | null
          rating_comment?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taxi_rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "delivery_drivers"
            referencedColumns: ["id"]
          },
        ]
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
          status: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          location?: Json | null
          recorded_at?: string | null
          status?: string
          updated_at?: string
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
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: string | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: string | null
          f_table_schema?: string | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: string | null
          f_table_schema?: string | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: {
          oldname: string
          newname: string
          version: string
        }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: {
          tbl: unknown
          col: string
        }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: {
          tbl: unknown
          att_name: string
          geom: unknown
          mode?: string
        }
        Returns: number
      }
      _st_3dintersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      _st_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_coveredby:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      _st_covers:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      _st_crosses: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_intersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_length: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      _st_makevalid: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _st_union:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
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
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}
