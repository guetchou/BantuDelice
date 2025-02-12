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
      achievements: {
        Row: {
          conditions: Json | null
          created_at: string | null
          description: string
          icon_url: string | null
          id: string
          name: string
          points_value: number | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          description: string
          icon_url?: string | null
          id?: string
          name: string
          points_value?: number | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
          points_value?: number | null
        }
        Relationships: []
      }
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
      cooking_classes: {
        Row: {
          chef_id: string | null
          created_at: string | null
          cuisine_type: string
          current_participants: number | null
          description: string | null
          difficulty_level: string | null
          duration: number
          id: string
          ingredients: Json | null
          max_participants: number
          price: number
          schedule: string
          status: string | null
          title: string
        }
        Insert: {
          chef_id?: string | null
          created_at?: string | null
          cuisine_type: string
          current_participants?: number | null
          description?: string | null
          difficulty_level?: string | null
          duration: number
          id?: string
          ingredients?: Json | null
          max_participants: number
          price: number
          schedule: string
          status?: string | null
          title: string
        }
        Update: {
          chef_id?: string | null
          created_at?: string | null
          cuisine_type?: string
          current_participants?: number | null
          description?: string | null
          difficulty_level?: string | null
          duration?: number
          id?: string
          ingredients?: Json | null
          max_participants?: number
          price?: number
          schedule?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      cultural_events: {
        Row: {
          capacity: number | null
          category: string
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          location: string
          price: number
          registered_count: number | null
          search_vector: unknown | null
          status: string
          title: string
        }
        Insert: {
          capacity?: number | null
          category: string
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          location: string
          price?: number
          registered_count?: number | null
          search_vector?: unknown | null
          status?: string
          title: string
        }
        Update: {
          capacity?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string
          price?: number
          registered_count?: number | null
          search_vector?: unknown | null
          status?: string
          title?: string
        }
        Relationships: []
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
      delivery_preferences: {
        Row: {
          allergies: string[] | null
          created_at: string | null
          default_address: string | null
          dietary_restrictions: string[] | null
          favorite_delivery_times: Json | null
          id: string
          no_contact_delivery: boolean | null
          preferred_payment_method: string | null
          special_instructions: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string | null
          default_address?: string | null
          dietary_restrictions?: string[] | null
          favorite_delivery_times?: Json | null
          id?: string
          no_contact_delivery?: boolean | null
          preferred_payment_method?: string | null
          special_instructions?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string | null
          default_address?: string | null
          dietary_restrictions?: string[] | null
          favorite_delivery_times?: Json | null
          id?: string
          no_contact_delivery?: boolean | null
          preferred_payment_method?: string | null
          special_instructions?: string | null
          updated_at?: string | null
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
      delivery_zones: {
        Row: {
          active: boolean | null
          base_delivery_fee: number | null
          created_at: string | null
          description: string | null
          estimated_time_range: Json | null
          id: string
          minimum_order: number | null
          name: string
          polygon: unknown | null
        }
        Insert: {
          active?: boolean | null
          base_delivery_fee?: number | null
          created_at?: string | null
          description?: string | null
          estimated_time_range?: Json | null
          id?: string
          minimum_order?: number | null
          name: string
          polygon?: unknown | null
        }
        Update: {
          active?: boolean | null
          base_delivery_fee?: number | null
          created_at?: string | null
          description?: string | null
          estimated_time_range?: Json | null
          id?: string
          minimum_order?: number | null
          name?: string
          polygon?: unknown | null
        }
        Relationships: []
      }
      detailed_restaurant_reviews: {
        Row: {
          created_at: string | null
          delivery_rating: number | null
          food_quality_rating: number | null
          helpful_count: number | null
          id: string
          order_id: string | null
          overall_rating: number | null
          photos: string[] | null
          restaurant_id: string | null
          review_text: string | null
          service_rating: number | null
          updated_at: string | null
          user_id: string | null
          value_rating: number | null
          verified_purchase: boolean | null
        }
        Insert: {
          created_at?: string | null
          delivery_rating?: number | null
          food_quality_rating?: number | null
          helpful_count?: number | null
          id?: string
          order_id?: string | null
          overall_rating?: number | null
          photos?: string[] | null
          restaurant_id?: string | null
          review_text?: string | null
          service_rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          value_rating?: number | null
          verified_purchase?: boolean | null
        }
        Update: {
          created_at?: string | null
          delivery_rating?: number | null
          food_quality_rating?: number | null
          helpful_count?: number | null
          id?: string
          order_id?: string | null
          overall_rating?: number | null
          photos?: string[] | null
          restaurant_id?: string | null
          review_text?: string | null
          service_rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          value_rating?: number | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "detailed_restaurant_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detailed_restaurant_reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
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
      event_registrations: {
        Row: {
          event_id: string | null
          id: string
          registration_date: string | null
          status: string
          ticket_code: string | null
          user_id: string | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          registration_date?: string | null
          status?: string
          ticket_code?: string | null
          user_id?: string | null
        }
        Update: {
          event_id?: string | null
          id?: string
          registration_date?: string | null
          status?: string
          ticket_code?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "cultural_events"
            referencedColumns: ["id"]
          },
        ]
      }
      events_restaurant: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          event_date: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          restaurant_id: string | null
          status: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          restaurant_id?: string | null
          status?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          restaurant_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_restaurant_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
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
      food_artisans: {
        Row: {
          business_name: string
          certification: string[] | null
          contact_info: Json | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          location: string
          rating: number | null
          specialty: string
          user_id: string | null
        }
        Insert: {
          business_name: string
          certification?: string[] | null
          contact_info?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          location: string
          rating?: number | null
          specialty: string
          user_id?: string | null
        }
        Update: {
          business_name?: string
          certification?: string[] | null
          contact_info?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          location?: string
          rating?: number | null
          specialty?: string
          user_id?: string | null
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
      inventory_transactions: {
        Row: {
          created_at: string | null
          id: string
          inventory_id: string | null
          performed_by: string | null
          quantity_change: number
          reason: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          performed_by?: string | null
          quantity_change: number
          reason?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          performed_by?: string | null
          quantity_change?: number
          reason?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory_levels"
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
          achievement_points: number | null
          benefits: Json | null
          created_at: string | null
          id: string
          level: string | null
          lifetime_points: number | null
          points: number | null
          points_expiry: string | null
          points_to_next_tier: number | null
          tier_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_points?: number | null
          benefits?: Json | null
          created_at?: string | null
          id?: string
          level?: string | null
          lifetime_points?: number | null
          points?: number | null
          points_expiry?: string | null
          points_to_next_tier?: number | null
          tier_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_points?: number | null
          benefits?: Json | null
          created_at?: string | null
          id?: string
          level?: string | null
          lifetime_points?: number | null
          points?: number | null
          points_expiry?: string | null
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
      menu_schedules: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_special: boolean | null
          menu_items: string[] | null
          name: string | null
          restaurant_id: string | null
          start_date: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_special?: boolean | null
          menu_items?: string[] | null
          name?: string | null
          restaurant_id?: string | null
          start_date: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_special?: boolean | null
          menu_items?: string[] | null
          name?: string | null
          restaurant_id?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_schedules_restaurant_id_fkey"
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
      order_tracking_details: {
        Row: {
          estimated_completion_time: string | null
          handled_by: string | null
          id: string
          location_data: Json | null
          notes: string | null
          order_id: string | null
          status: string
          timestamp: string | null
        }
        Insert: {
          estimated_completion_time?: string | null
          handled_by?: string | null
          id?: string
          location_data?: Json | null
          notes?: string | null
          order_id?: string | null
          status: string
          timestamp?: string | null
        }
        Update: {
          estimated_completion_time?: string | null
          handled_by?: string | null
          id?: string
          location_data?: Json | null
          notes?: string | null
          order_id?: string | null
          status?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_details_order_id_fkey"
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
          created_at?: string
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
          restaurant_id?: string
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
      recipe_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          rating: number | null
          recipe_id: string | null
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          rating?: number | null
          recipe_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          recipe_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_sharing"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_sharing: {
        Row: {
          cooking_time: number | null
          created_at: string | null
          cuisine_type: string
          description: string | null
          difficulty_level: string | null
          id: string
          image_url: string | null
          ingredients: Json
          instructions: Json
          is_featured: boolean | null
          likes_count: number | null
          preparation_time: number | null
          search_vector: unknown | null
          title: string
          user_id: string | null
        }
        Insert: {
          cooking_time?: number | null
          created_at?: string | null
          cuisine_type: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          ingredients: Json
          instructions: Json
          is_featured?: boolean | null
          likes_count?: number | null
          preparation_time?: number | null
          search_vector?: unknown | null
          title: string
          user_id?: string | null
        }
        Update: {
          cooking_time?: number | null
          created_at?: string | null
          cuisine_type?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: Json
          is_featured?: boolean | null
          likes_count?: number | null
          preparation_time?: number | null
          search_vector?: unknown | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
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
          id?: string
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
          restaurant_id?: string
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
      restaurant_events: {
        Row: {
          booking_required: boolean | null
          capacity: number | null
          created_at: string
          description: string | null
          end_date: string
          event_name: string
          event_type: string | null
          id: string
          price_per_person: number | null
          restaurant_id: string | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          booking_required?: boolean | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_date: string
          event_name: string
          event_type?: string | null
          id?: string
          price_per_person?: number | null
          restaurant_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          booking_required?: boolean | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_date?: string
          event_name?: string
          event_type?: string | null
          id?: string
          price_per_person?: number | null
          restaurant_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_events_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_peak_hours: {
        Row: {
          created_at: string
          day_of_week: string
          end_time: string
          id: string
          peak_level: number | null
          restaurant_id: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: string
          end_time: string
          id?: string
          peak_level?: number | null
          restaurant_id?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: string
          end_time?: string
          id?: string
          peak_level?: number | null
          restaurant_id?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_peak_hours_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_promotions: {
        Row: {
          active: boolean | null
          conditions: string[] | null
          created_at: string | null
          description: string | null
          discount_type: string | null
          discount_value: number | null
          end_date: string | null
          id: string
          min_order_amount: number | null
          restaurant_id: string | null
          start_date: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          conditions?: string[] | null
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          end_date?: string | null
          id?: string
          min_order_amount?: number | null
          restaurant_id?: string | null
          start_date?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          conditions?: string[] | null
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          end_date?: string | null
          id?: string
          min_order_amount?: number | null
          restaurant_id?: string | null
          start_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_promotions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          restaurant_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          restaurant_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          restaurant_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          accessibility_features: string[] | null
          address: string
          ambiance: string[] | null
          average_prep_time: number | null
          average_rating: number | null
          average_ticket: number | null
          banner_image_url: string | null
          business_hours: Json | null
          capacity: number | null
          certification: string[] | null
          created_at: string
          cuisine_type: string | null
          delivery_fee: number | null
          delivery_radius: number | null
          delivery_zones: Json | null
          description: string | null
          dress_code: string | null
          email: string | null
          estimated_preparation_time: number | null
          featured: boolean | null
          features: string[] | null
          holidays: Json | null
          id: string
          latitude: number | null
          location: unknown | null
          logo_url: string | null
          longitude: number | null
          menu_categories: Json | null
          min_order_amount: number | null
          minimum_order: number | null
          name: string
          opening_hours: Json | null
          order_count: number | null
          parking_options: string[] | null
          payment_methods: string[] | null
          phone: string | null
          rating: number | null
          review_count: number | null
          search_vector: unknown | null
          services: string[] | null
          social_media: Json | null
          special_hours: Json | null
          specialties: string[] | null
          status: string | null
          tags: string[] | null
          tax_rate: number | null
          total_ratings: number | null
          total_revenue: number | null
          trending: boolean | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          address: string
          ambiance?: string[] | null
          average_prep_time?: number | null
          average_rating?: number | null
          average_ticket?: number | null
          banner_image_url?: string | null
          business_hours?: Json | null
          capacity?: number | null
          certification?: string[] | null
          created_at?: string
          cuisine_type?: string | null
          delivery_fee?: number | null
          delivery_radius?: number | null
          delivery_zones?: Json | null
          description?: string | null
          dress_code?: string | null
          email?: string | null
          estimated_preparation_time?: number | null
          featured?: boolean | null
          features?: string[] | null
          holidays?: Json | null
          id?: string
          latitude?: number | null
          location?: unknown | null
          logo_url?: string | null
          longitude?: number | null
          menu_categories?: Json | null
          min_order_amount?: number | null
          minimum_order?: number | null
          name: string
          opening_hours?: Json | null
          order_count?: number | null
          parking_options?: string[] | null
          payment_methods?: string[] | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          search_vector?: unknown | null
          services?: string[] | null
          social_media?: Json | null
          special_hours?: Json | null
          specialties?: string[] | null
          status?: string | null
          tags?: string[] | null
          tax_rate?: number | null
          total_ratings?: number | null
          total_revenue?: number | null
          trending?: boolean | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          address?: string
          ambiance?: string[] | null
          average_prep_time?: number | null
          average_rating?: number | null
          average_ticket?: number | null
          banner_image_url?: string | null
          business_hours?: Json | null
          capacity?: number | null
          certification?: string[] | null
          created_at?: string
          cuisine_type?: string | null
          delivery_fee?: number | null
          delivery_radius?: number | null
          delivery_zones?: Json | null
          description?: string | null
          dress_code?: string | null
          email?: string | null
          estimated_preparation_time?: number | null
          featured?: boolean | null
          features?: string[] | null
          holidays?: Json | null
          id?: string
          latitude?: number | null
          location?: unknown | null
          logo_url?: string | null
          longitude?: number | null
          menu_categories?: Json | null
          min_order_amount?: number | null
          minimum_order?: number | null
          name?: string
          opening_hours?: Json | null
          order_count?: number | null
          parking_options?: string[] | null
          payment_methods?: string[] | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          search_vector?: unknown | null
          services?: string[] | null
          social_media?: Json | null
          special_hours?: Json | null
          specialties?: string[] | null
          status?: string | null
          tags?: string[] | null
          tax_rate?: number | null
          total_ratings?: number | null
          total_revenue?: number | null
          trending?: boolean | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          images: string[] | null
          rating: number
          restaurant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          rating: number
          restaurant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          rating?: number
          restaurant_id?: string
          updated_at?: string
          user_id?: string
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
      special_menus: {
        Row: {
          active: boolean | null
          advance_notice_hours: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          items: Json | null
          menu_type: string | null
          minimum_people: number | null
          name: string
          price_per_person: number | null
          requires_advance_notice: boolean | null
          restaurant_id: string | null
          start_date: string | null
        }
        Insert: {
          active?: boolean | null
          advance_notice_hours?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          items?: Json | null
          menu_type?: string | null
          minimum_people?: number | null
          name: string
          price_per_person?: number | null
          requires_advance_notice?: boolean | null
          restaurant_id?: string | null
          start_date?: string | null
        }
        Update: {
          active?: boolean | null
          advance_notice_hours?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          items?: Json | null
          menu_type?: string | null
          minimum_people?: number | null
          name?: string
          price_per_person?: number | null
          requires_advance_notice?: boolean | null
          restaurant_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "special_menus_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      table_reservations: {
        Row: {
          created_at: string | null
          id: string
          number_of_people: number
          reservation_date: string
          restaurant_id: string | null
          special_requests: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          number_of_people: number
          reservation_date: string
          restaurant_id?: string | null
          special_requests?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          number_of_people?: number
          reservation_date?: string
          restaurant_id?: string | null
          special_requests?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      taxi_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_details: Json | null
          payment_method: string | null
          payment_status: string | null
          ride_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          ride_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          ride_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxi_payments_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "taxi_rides"
            referencedColumns: ["id"]
          },
        ]
      }
      taxi_ratings: {
        Row: {
          cleanliness: number | null
          comment: string | null
          communication: number | null
          created_at: string | null
          driving_quality: number | null
          id: string
          punctuality: number | null
          rating: number
          ride_id: string
        }
        Insert: {
          cleanliness?: number | null
          comment?: string | null
          communication?: number | null
          created_at?: string | null
          driving_quality?: number | null
          id?: string
          punctuality?: number | null
          rating: number
          ride_id: string
        }
        Update: {
          cleanliness?: number | null
          comment?: string | null
          communication?: number | null
          created_at?: string | null
          driving_quality?: number | null
          id?: string
          punctuality?: number | null
          rating?: number
          ride_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxi_ratings_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "taxi_rides"
            referencedColumns: ["id"]
          },
        ]
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
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          dark_mode: boolean | null
          dietary_restrictions: string[] | null
          email_notifications: boolean | null
          favorite_cuisines: string[] | null
          id: string
          language: string | null
          notifications: boolean | null
          order_updates: boolean | null
          preferred_restaurants: string[] | null
          price_preference: number | null
          promotional_emails: boolean | null
          push_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dark_mode?: boolean | null
          dietary_restrictions?: string[] | null
          email_notifications?: boolean | null
          favorite_cuisines?: string[] | null
          id?: string
          language?: string | null
          notifications?: boolean | null
          order_updates?: boolean | null
          preferred_restaurants?: string[] | null
          price_preference?: number | null
          promotional_emails?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dark_mode?: boolean | null
          dietary_restrictions?: string[] | null
          email_notifications?: boolean | null
          favorite_cuisines?: string[] | null
          id?: string
          language?: string | null
          notifications?: boolean | null
          order_updates?: boolean | null
          preferred_restaurants?: string[] | null
          price_preference?: number | null
          promotional_emails?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
          preferences: Json | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          preferences?: Json | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          preferences?: Json | null
          updated_at?: string
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
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
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
      _st_linecrossingdirection: {
        Args: {
          line1: unknown
          line2: unknown
        }
        Returns: number
      }
      _st_longestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      _st_orderingequals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: {
          geom: unknown
        }
        Returns: number
      }
      _st_touches: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      addauth: {
        Args: {
          "": string
        }
        Returns: boolean
      }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
      box:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box2d:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box2d_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2d_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2df_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2df_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3d:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box3d_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3d_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3dtobox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      bytea:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      check_restaurant_availability: {
        Args: {
          restaurant_id: string
          check_time?: string
        }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_message: string
          p_type: string
          p_link?: string
          p_action_type?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
              column_name: string
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
              column_name: string
            }
            Returns: string
          }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
            }
            Returns: string
          }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geography:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      geography_analyze: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      geography_typmod_out: {
        Args: {
          "": number
        }
        Returns: unknown
      }
      geometry:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      geometry_above: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_analyze: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      geometry_below: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_cmp: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_contained_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_eq: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_ge: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      geometry_gt: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_hash: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      geometry_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_le: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_left: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_lt: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_overabove: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overleft: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overright: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_right: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_same: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      geometry_sortsupport: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      geometry_typmod_out: {
        Args: {
          "": number
        }
        Returns: unknown
      }
      geometry_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometrytype:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      geomfromewkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      geomfromewkt: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      get_proj4_from_srid: {
        Args: {
          "": number
        }
        Returns: string
      }
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
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gidx_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      json: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      jsonb: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      point: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      polygon: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      populate_geometry_columns:
        | {
            Args: {
              tbl_oid: unknown
              use_typmod?: boolean
            }
            Returns: number
          }
        | {
            Args: {
              use_typmod?: boolean
            }
            Returns: string
          }
      postgis_addbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: number
      }
      postgis_constraint_type: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: string
      }
      postgis_dropbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: {
          "": number
        }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: {
          "": number
        }
        Returns: number
      }
      postgis_typmod_type: {
        Args: {
          "": number
        }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      reserve_stock: {
        Args: {
          p_menu_item_id: string
          p_quantity: number
        }
        Returns: boolean
      }
      search_restaurants: {
        Args: {
          search_query: string
        }
        Returns: {
          accessibility_features: string[] | null
          address: string
          ambiance: string[] | null
          average_prep_time: number | null
          average_rating: number | null
          average_ticket: number | null
          banner_image_url: string | null
          business_hours: Json | null
          capacity: number | null
          certification: string[] | null
          created_at: string
          cuisine_type: string | null
          delivery_fee: number | null
          delivery_radius: number | null
          delivery_zones: Json | null
          description: string | null
          dress_code: string | null
          email: string | null
          estimated_preparation_time: number | null
          featured: boolean | null
          features: string[] | null
          holidays: Json | null
          id: string
          latitude: number | null
          location: unknown | null
          logo_url: string | null
          longitude: number | null
          menu_categories: Json | null
          min_order_amount: number | null
          minimum_order: number | null
          name: string
          opening_hours: Json | null
          order_count: number | null
          parking_options: string[] | null
          payment_methods: string[] | null
          phone: string | null
          rating: number | null
          review_count: number | null
          search_vector: unknown | null
          services: string[] | null
          social_media: Json | null
          special_hours: Json | null
          specialties: string[] | null
          status: string | null
          tags: string[] | null
          tax_rate: number | null
          total_ratings: number | null
          total_revenue: number | null
          trending: boolean | null
          user_id: string | null
          website: string | null
        }[]
      }
      spheroid_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      spheroid_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3ddistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_3dintersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_3dlength: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_3dlongestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_3dperimeter: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_3dshortestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_addpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_angle:
        | {
            Args: {
              line1: unknown
              line2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              pt1: unknown
              pt2: unknown
              pt3: unknown
              pt4?: unknown
            }
            Returns: number
          }
      st_area:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_area2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_asbinary:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_asencodedpolyline: {
        Args: {
          geom: unknown
          nprecision?: number
        }
        Returns: string
      }
      st_asewkb: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_asewkt:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_asgeojson:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
            Returns: string
          }
      st_asgml:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
        | {
            Args: {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
      st_ashexewkb: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_askml:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              nprefix?: string
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              nprefix?: string
            }
            Returns: string
          }
      st_aslatlontext: {
        Args: {
          geom: unknown
          tmpl?: string
        }
        Returns: string
      }
      st_asmarc21: {
        Args: {
          geom: unknown
          format?: string
        }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              rel?: number
              maxdecimaldigits?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              rel?: number
              maxdecimaldigits?: number
            }
            Returns: string
          }
      st_astext:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_astwkb:
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: {
          geom: unknown
          maxdecimaldigits?: number
          options?: number
        }
        Returns: string
      }
      st_azimuth:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
      st_boundary: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: {
          geom: unknown
          fits?: boolean
        }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: {
              geom: unknown
              radius: number
              options?: string
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              radius: number
              quadsegs: number
            }
            Returns: unknown
          }
      st_buildarea: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_centroid:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      st_cleangeometry: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: {
          geom: unknown
          box: unknown
        }
        Returns: unknown
      }
      st_closestpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: {
          "": unknown[]
        }
        Returns: unknown[]
      }
      st_collect:
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
      st_collectionextract: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_containsproperly: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_convexhull: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_coorddim: {
        Args: {
          geometry: unknown
        }
        Returns: number
      }
      st_coveredby:
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
      st_covers:
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
      st_crosses: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_curvetoline: {
        Args: {
          geom: unknown
          tol?: number
          toltype?: number
          flags?: number
        }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: {
          g1: unknown
          tolerance?: number
          flags?: number
        }
        Returns: unknown
      }
      st_difference: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_dimension: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_disjoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_distance:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
      st_distancesphere:
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
              radius: number
            }
            Returns: number
          }
      st_distancespheroid: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_dump: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_envelope: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_expand:
        | {
            Args: {
              box: unknown
              dx: number
              dy: number
            }
            Returns: unknown
          }
        | {
            Args: {
              box: unknown
              dx: number
              dy: number
              dz?: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              dx: number
              dy: number
              dz?: number
              dm?: number
            }
            Returns: unknown
          }
      st_exteriorring: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_force2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_force3d: {
        Args: {
          geom: unknown
          zvalue?: number
        }
        Returns: unknown
      }
      st_force3dm: {
        Args: {
          geom: unknown
          mvalue?: number
        }
        Returns: unknown
      }
      st_force3dz: {
        Args: {
          geom: unknown
          zvalue?: number
        }
        Returns: unknown
      }
      st_force4d: {
        Args: {
          geom: unknown
          zvalue?: number
          mvalue?: number
        }
        Returns: unknown
      }
      st_forcecollection: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcecurve: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcerhr: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcesfs: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_generatepoints:
        | {
            Args: {
              area: unknown
              npoints: number
            }
            Returns: unknown
          }
        | {
            Args: {
              area: unknown
              npoints: number
              seed: number
            }
            Returns: unknown
          }
      st_geogfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geohash:
        | {
            Args: {
              geog: unknown
              maxchars?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxchars?: number
            }
            Returns: string
          }
      st_geomcollfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geometrytype: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_geomfromewkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromgeojson:
        | {
            Args: {
              "": Json
            }
            Returns: unknown
          }
        | {
            Args: {
              "": Json
            }
            Returns: unknown
          }
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
      st_geomfromgml: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: {
          marc21xml: string
        }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_gmltosql: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_hasarc: {
        Args: {
          geometry: unknown
        }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_hexagon: {
        Args: {
          size: number
          cell_i: number
          cell_j: number
          origin?: unknown
        }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: {
          size: number
          bounds: unknown
        }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: {
          line: unknown
          point: unknown
        }
        Returns: number
      }
      st_intersection: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_intersects:
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
      st_isclosed: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_iscollection: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isempty: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isring: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_issimple: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isvalid: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: {
          geom: unknown
          flags?: number
        }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_length:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_length2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_letters: {
        Args: {
          letters: string
          font?: Json
        }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: {
          line1: unknown
          line2: unknown
        }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: {
          txtin: string
          nprecision?: number
        }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_linefromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_linemerge: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linetocurve: {
        Args: {
          geometry: unknown
        }
        Returns: unknown
      }
      st_locatealong: {
        Args: {
          geometry: unknown
          measure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: {
          geometry: unknown
          fromelevation: number
          toelevation: number
        }
        Returns: unknown
      }
      st_longestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_m: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_makebox2d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_makeline:
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
      st_makepolygon: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_makevalid:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              params: string
            }
            Returns: unknown
          }
      st_maxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: {
          "": unknown
        }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: {
          inputgeom: unknown
          segs_per_quarter?: number
        }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: {
          "": unknown
        }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multi: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_ndims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_node: {
        Args: {
          g: unknown
        }
        Returns: unknown
      }
      st_normalize: {
        Args: {
          geom: unknown
        }
        Returns: unknown
      }
      st_npoints: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_nrings: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numgeometries: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numinteriorring: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numinteriorrings: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numpatches: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numpoints: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_offsetcurve: {
        Args: {
          line: unknown
          distance: number
          params?: string
        }
        Returns: unknown
      }
      st_orderingequals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_perimeter:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_perimeter2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_pointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_points: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonize: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      st_project: {
        Args: {
          geog: unknown
          distance: number
          azimuth: number
        }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: {
          geom: unknown
          gridsize: number
        }
        Returns: unknown
      }
      st_relate: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: {
          geom: unknown
          tolerance?: number
        }
        Returns: unknown
      }
      st_reverse: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_segmentize: {
        Args: {
          geog: unknown
          max_segment_length: number
        }
        Returns: unknown
      }
      st_setsrid:
        | {
            Args: {
              geog: unknown
              srid: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              srid: number
            }
            Returns: unknown
          }
      st_sharedpaths: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_shortestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: {
          geom: unknown
          vertex_fraction: number
          is_outer?: boolean
        }
        Returns: unknown
      }
      st_split: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_square: {
        Args: {
          size: number
          cell_i: number
          cell_j: number
          origin?: unknown
        }
        Returns: unknown
      }
      st_squaregrid: {
        Args: {
          size: number
          bounds: unknown
        }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | {
            Args: {
              geog: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom: unknown
            }
            Returns: number
          }
      st_startpoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_subdivide: {
        Args: {
          geom: unknown
          maxvertices?: number
          gridsize?: number
        }
        Returns: unknown[]
      }
      st_summary:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_swapordinates: {
        Args: {
          geom: unknown
          ords: unknown
        }
        Returns: unknown
      }
      st_symdifference: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_transform:
        | {
            Args: {
              geom: unknown
              from_proj: string
              to_proj: string
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              from_proj: string
              to_srid: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              to_proj: string
            }
            Returns: unknown
          }
      st_triangulatepolygon: {
        Args: {
          g1: unknown
        }
        Returns: unknown
      }
      st_union:
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
        | {
            Args: {
              geom1: unknown
              geom2: unknown
              gridsize: number
            }
            Returns: unknown
          }
      st_voronoilines: {
        Args: {
          g1: unknown
          tolerance?: number
          extend_to?: unknown
        }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: {
          g1: unknown
          tolerance?: number
          extend_to?: unknown
        }
        Returns: unknown
      }
      st_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: {
          wkb: string
        }
        Returns: unknown
      }
      st_wkttosql: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_wrapx: {
        Args: {
          geom: unknown
          wrap: number
          move: number
        }
        Returns: unknown
      }
      st_x: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_xmax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_xmin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_y: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_ymax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_ymin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_z: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmflag: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      unlockrows: {
        Args: {
          "": string
        }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
      validate_order_stock: {
        Args: {
          items: Json
        }
        Returns: {
          is_valid: boolean
          message: string
          invalid_items: Json
        }[]
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
