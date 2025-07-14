
export interface OpeningHours {
  open: string;
  close: string;
  closed?: boolean;
  is_closed?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  cuisine_type: string;
  rating: number;
  average_rating?: number;
  review_count: number;
  delivery_time: string;
  delivery_fee: number;
  min_order?: number;
  phone?: string;
  address?: string;
  opening_hours?: OpeningHours;
  is_open?: boolean;
  special_features?: string[];
  payment_methods?: string[];
  categories?: string[];
  featured?: boolean;
  promotions?: any[];
  distance?: number;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  location?: string;
}

export interface RestaurantFilters {
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceRange: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'delivery_driver';
  created_at: string;
  updated_at?: string;
}

export interface ExtendedRestaurant extends Restaurant {
  menu_items?: any[];
  orders?: any[];
  analytics?: any;
}
