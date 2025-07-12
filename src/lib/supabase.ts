import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la compatibilité avec l'ancien code
export interface Restaurant {
  id: number
  name: string
  description: string
  image_url: string
  rating: number
  delivery_time: number
  delivery_fee: number
  cuisine_type: string
  address: string
  phone: string
  email?: string
  latitude?: number
  longitude?: number
  is_open: boolean
  delivery_radius: number
  min_order_amount: number
  avg_preparation_time: number
  created_at: string
  updated_at: string
}

// Database types (you can generate these with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: number
          name: string
          description: string
          image_url: string
          rating: number
          delivery_time: number
          delivery_fee: number
          cuisine_type: string
          address: string
          phone: string
          email?: string
          latitude?: number
          longitude?: number
          is_open: boolean
          delivery_radius: number
          min_order_amount: number
          avg_preparation_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          image_url: string
          rating?: number
          delivery_time: number
          delivery_fee: number
          cuisine_type: string
          address: string
          phone: string
          email?: string
          latitude?: number
          longitude?: number
          is_open?: boolean
          delivery_radius?: number
          min_order_amount?: number
          avg_preparation_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          image_url?: string
          rating?: number
          delivery_time?: number
          delivery_fee?: number
          cuisine_type?: string
          address?: string
          phone?: string
          email?: string
          latitude?: number
          longitude?: number
          is_open?: boolean
          delivery_radius?: number
          min_order_amount?: number
          avg_preparation_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: number
          restaurant_id: number
          name: string
          description: string
          price: number
          image_url: string
          category: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: number
          restaurant_id: number
          name: string
          description: string
          price: number
          image_url: string
          category: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          restaurant_id?: number
          name?: string
          description?: string
          price?: number
          image_url?: string
          category?: string
          available?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          restaurant_id: number
          items: any
          total: number
          status: string
          delivery_address: string
          delivery_phone: string
          delivery_name: string
          payment_method: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          restaurant_id: number
          items: any
          total: number
          status?: string
          delivery_address: string
          delivery_phone: string
          delivery_name: string
          payment_method: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          restaurant_id?: number
          items?: any
          total?: number
          status?: string
          delivery_address?: string
          delivery_phone?: string
          delivery_name?: string
          payment_method?: string
          created_at?: string
        }
      }
    }
  }
} 