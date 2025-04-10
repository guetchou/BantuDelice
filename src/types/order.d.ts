
export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  delivery_address: string;
  payment_status: string;
  payment_method: string;
  delivery_status: string;
  
  // Propriétés étendues
  order_items: OrderItem[];
  special_instructions?: string;
  estimated_preparation_time?: number;
  loyalty_points_earned?: number;
  delivered_at?: string;
  cancelled_at?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'prepared'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  item_name: string;
  options?: string;
  special_instructions?: string;
}

export interface OrderItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant_id: string;
  total: number;
  image_url?: string;
  options?: CartItemOption[];
  special_instructions?: string;
}

export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
}
