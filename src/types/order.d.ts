
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'prepared' | 'delivering' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  delivery_address: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_method?: string;
  delivery_instructions?: string;
  special_requests?: any;
  delivery_status?: string;
  estimated_delivery_time?: string;
  accepted_at?: string;
  prepared_at?: string;
  delivery_fee?: number;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  options?: OrderItemOption[];
  total: number;
}

export interface OrderItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
}
