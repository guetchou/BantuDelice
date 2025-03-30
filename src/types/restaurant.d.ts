
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine_type?: string | string[];
  description?: string;
  latitude: number;
  longitude: number;
  banner_image_url?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  average_rating?: number;
  price_range: string;
  created_at: string;
  updated_at?: string;
  is_open?: boolean;
  special_days?: any;
  contact_phone?: string;
  contact_email?: string;
  estimated_delivery_time?: number;
  opening_date?: string;
  special_features?: string[];
  free_delivery_min?: number;
}

export interface BusinessHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  user_id: string;
  date: string;
  time: string;
  number_of_people: number;
  contact_phone: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface RestaurantPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery';
  discount_value: number;
  start_date?: string;
  end_date?: string;
  active: boolean;
  min_order_value?: number;
  code?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
  total_earnings: number;
  commission_rate: number;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: TransactionType;
  status: string;
  description?: string;
  created_at: string;
  reference_number?: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'commission';

export interface InventoryLevel {
  id: string;
  menu_item_id: string;
  current_stock: number;
  reserved_stock: number;
  min_stock_level: number;
  last_restock_date?: string;
  next_restock_date?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
}
