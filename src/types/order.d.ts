
export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  order_items: OrderItem[];
  status: OrderStatus;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: string;
  created_at: string;
  updated_at?: string;
  delivery_address_id?: string;
  delivery_address?: string;
  delivery_fee?: number;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  special_instructions?: string;
  delivery_instructions?: string;
  coupon_id?: string;
  discount_amount?: number;
  driver_id?: string;
  tip_amount?: number;
  tax_amount?: number;
  subtotal_amount?: number;
  
  // Additional fields from the database
  rating?: number;
  accepted_at?: string;
  prepared_at?: string;
  restaurant_rating?: number;
  loyalty_points_earned?: number;
  estimated_preparation_time?: number;
  special_requests?: any;
  delivery_time_preference?: string;
  cancelled_at?: string;
  stock_validated?: boolean;
  delivery_status?: string;
  rating_comment?: string;
  restaurant_comment?: string;
  payment_reference?: string;
  cancellation_reason?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  special_instructions?: string;
  created_at: string;
  options?: Array<{
    name: string;
    value: string;
    price: number;
  }>;
  item_name?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'prepared'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface OrderTrackingDetail {
  id: string;
  order_id: string;
  status: OrderStatus;
  timestamp: string;
  notes?: string;
  location_data?: {
    latitude: number;
    longitude: number;
  };
  handled_by?: string;
  estimated_completion_time?: string;
}

export interface OrderWithDetails extends Order {
  restaurant: {
    id: string;
    name: string;
    logo_url?: string;
    phone?: string;
  };
  items: (OrderItem & {
    menu_item: {
      name: string;
      image_url?: string;
      description?: string;
    }
  })[];
  delivery_address?: {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
  };
}
