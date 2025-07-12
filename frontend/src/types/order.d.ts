
import { CartItem, CartItemOption } from '@/contexts/CartContext';

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled' | 'prepared';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'completed';

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  delivery_address: string;
  delivery_status?: string;
  created_at: string;
  updated_at: string;
  payment_method?: string;
  payment_reference?: string;
  delivery_instructions?: string;
  special_instructions?: string;
  cancellation_reason?: string;
  rating?: number;
  rating_comment?: string;
  restaurant_rating?: number;
  restaurant_comment?: string;
  accepted_at?: string;
  prepared_at?: string;
  cancelled_at?: string;
  delivered_at?: string;
  estimated_preparation_time?: number;
  delivery_time_preference?: string;
  loyalty_points_earned?: number;
  tip_amount?: number;
  delivery_fee?: number;
  promo_code_applied?: string;
  order_items?: OrderItem[];
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  stock_validated?: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_name: string;
  quantity: number;
  price: number;
  menu_item_id?: string;
  options?: CartItemOption[];
  subtotal?: number;
  special_instructions?: string;
}

export type DeliveryStatus = 'pending' | 'assigned' | 'accepted' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderTracking {
  id: string;
  order_id: string;
  status: OrderStatus | DeliveryStatus;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  note?: string;
}

export { CartItem, CartItemOption };
