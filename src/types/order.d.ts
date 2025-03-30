
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
  subtotal: number;
  tax: number;
  total: number;
  delivery_fee: number;
  delivery_address: string;
  delivery_instructions?: string;
  contact_phone: string;
  created_at: string;
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  special_instructions?: string;
  promo_code_applied?: string;
  discount_amount?: number;
  payment_method: string;
  delivery_method: 'delivery' | 'pickup';
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
  total_price: number;
  options?: OrderItemOption[];
  notes?: string;
}

export interface OrderItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
}
