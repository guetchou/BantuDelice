export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          status: string
          total_amount: number
          delivery_address: string
          payment_status: string
          delivery_status: string
          created_at: string
          updated_at?: string
          estimated_preparation_time?: number
          delivery_instructions?: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          status?: string
          total_amount: number
          delivery_address: string
          payment_status?: string
          delivery_status?: string
          created_at?: string
          updated_at?: string
          estimated_preparation_time?: number
          delivery_instructions?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          status?: string
          total_amount?: number
          delivery_address?: string
          payment_status?: string
          delivery_status?: string
          created_at?: string
          updated_at?: string
          estimated_preparation_time?: number
          delivery_instructions?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          menu_item_id: string
          created_at: string
          menu_item: {
            id: string
            name: string
            description: string
            price: number
            image_url: string
          }
        }
        Insert: {
          id?: string
          user_id: string
          menu_item_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          menu_item_id?: string
          created_at?: string
        }
      }
      taxi_rides: {
        Row: {
          id: string
          user_id: string
          pickup_address: string
          destination_address: string
          pickup_time: string
          status: string
          driver_id?: string
          created_at?: string
          updated_at?: string
          estimated_price?: number
          actual_price?: number
          payment_status: string
          pickup_latitude?: number
          pickup_longitude?: number
          destination_latitude?: number
          destination_longitude?: number
          vehicle_type: string
          payment_method: string
          rating?: number
          rating_comment?: string
        }
        Insert: {
          id?: string
          user_id: string
          pickup_address: string
          destination_address: string
          pickup_time: string
          status?: string
          driver_id?: string
          created_at?: string
          updated_at?: string
          estimated_price?: number
          actual_price?: number
          payment_status?: string
          pickup_latitude?: number
          pickup_longitude?: number
          destination_latitude?: number
          destination_longitude?: number
          vehicle_type?: string
          payment_method?: string
          rating?: number
          rating_comment?: string
        }
        Update: {
          id?: string
          user_id?: string
          pickup_address?: string
          destination_address?: string
          pickup_time?: string
          status?: string
          driver_id?: string
          created_at?: string
          updated_at?: string
          estimated_price?: number
          actual_price?: number
          payment_status?: string
          pickup_latitude?: number
          pickup_longitude?: number
          destination_latitude?: number
          destination_longitude?: number
          vehicle_type?: string
          payment_method?: string
          rating?: number
          rating_comment?: string
        }
      }
      delivery_tracking: {
        Row: {
          id: string
          order_id: string
          status: string
          latitude?: number
          longitude?: number
          updated_at: string
          delivery_user_id?: string
          picked_up_at?: string
          delivered_at?: string
        }
      }
    }
  }
}