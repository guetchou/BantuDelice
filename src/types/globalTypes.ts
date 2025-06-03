
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: 'customer' | 'restaurant_owner' | 'driver' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  preferences?: {
    language?: string;
    notifications?: boolean;
    theme?: 'light' | 'dark';
  };
  address?: {
    street?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface ExtendedUserProfile extends UserProfile {
  loyalty_points?: number;
  total_orders?: number;
  favorite_restaurants?: string[];
  payment_methods?: PaymentMethod[];
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  price_range: number; // Changed from string to number
  cuisine_type?: string;
  rating?: number;
  average_rating?: number;
  is_open?: boolean;
  opening_hours?: any;
  delivery_fee?: number;
  minimum_order?: number;
  estimated_delivery_time?: number;
  image_url?: string;
  logo_url?: string;
  banner_url?: string;
  features?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  restaurant_id: string;
  special_instructions?: string;
  combo_item?: boolean;
  options: {
    id: string;
    name: string;
    value: string;
    price: number;
    quantity: number;
    price_adjustment: number;
  }[];
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
  preparation_time?: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  allergens?: string[];
  nutrition_info?: any;
  customization_options?: any[];
  stock_level?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'mobile_money' | 'cash' | 'wallet';
  details: any;
  is_default?: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  items: CartItem[];
  delivery_address?: string;
  payment_method?: PaymentMethod;
  created_at: string;
  updated_at?: string;
}

export interface SpecialHour {
  id: string;
  restaurant_id: string;
  date: string;
  opening_time?: string;
  closing_time?: string;
  is_closed: boolean;
  reason?: string;
}
