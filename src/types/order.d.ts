
export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  delivery_address: string;
  estimated_preparation_time?: number;
  actual_preparation_time?: number;
  special_instructions?: string;
  loyalty_points_earned?: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'prepared' | 'delivering' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'delivering' | 'delivered' | 'failed';
