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