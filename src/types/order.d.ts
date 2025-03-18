
// Types pour les commandes
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'prepared' | 'delivering' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus | string; // Rendre plus flexible pour compatibilité avec la BD
  total_amount: number;
  delivery_address: string;
  payment_status: string;
  delivery_status: string;
  created_at: string;
  updated_at?: string;
  estimated_preparation_time?: number;
  delivery_instructions?: string;
  items?: OrderItem[];
  loyalty_points_earned?: number;
  
  // Champs additionnels pour la compatibilité
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  actual_delivery_time?: string;
  cancellation_reason?: string;
  delivery_fee?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  options?: {
    name: string;
    value: string;
    price?: number;
  }[];
}

export interface OrderTrackingDetails {
  id: string;
  order_id: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered' | string;
  timestamp: string;
  updated_at: string;
  estimated_delivery_time: string;
  location_data: any | null;
  notes: string;
  handled_by: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  banner_image_url?: string;
  cuisine_type: string[] | string;
  price_range: number;
  rating: number;
  opening_hours: BusinessHours;
  status: 'open' | 'busy' | 'closed' | string;
  
  // Champs additionnels pour compatibilité
  average_rating?: number; 
  total_ratings?: number;
  business_hours?: any;
}

export interface BusinessHours {
  regular: {
    [key: string]: {
      open: string;
      close: string;
      is_closed?: boolean;
    };
  };
  special?: {
    date: string;
    open: string;
    close: string;
    is_closed?: boolean;
  }[];
}
