
export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'preparing' 
  | 'prepared' 
  | 'delivering' 
  | 'delivered' 
  | 'cancelled'
  | 'completed';

export interface OrderItem {
  id: string;
  order_id: string;
  item_name: string;
  quantity: number;
  price: number;
  options?: string;
  special_instructions?: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  total_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  delivery_address: string;
  delivery_fee: number;
  delivery_status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  special_instructions?: string;
  order_items: OrderItem[];
  delivery_driver_id?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  loyalty_points_earned?: number;
  accepted_at?: string;
  delivery_instructions?: string;
}

export interface OrderProgress {
  status: OrderStatus;
  timestamp: string;
  message: string;
}

export interface OrderTrackingUpdate {
  id: string;
  order_id: string;
  status: string;
  timestamp: string;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
