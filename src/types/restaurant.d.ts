
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  cuisine_type?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  banner_image_url?: string;
  opening_hours?: BusinessHours;
  rating?: number;
  min_order?: number;
  delivery_fee?: number;
  services?: string[];
  payment_methods?: string[];
  features?: string[];
  specialties?: string[];
  business_hours?: BusinessHours;
  
  // Propriétés supplémentaires
  min_order_amount?: number;
  price_range?: string;
  average_rating?: number;
  total_ratings?: number;
  average_prep_time?: number;
  estimated_delivery_time?: number;
  is_open?: boolean;
}

export interface BusinessDay {
  open: string;
  close: string;
  is_closed: boolean;
}

export interface BusinessHours {
  monday: BusinessDay;
  tuesday: BusinessDay;
  wednesday: BusinessDay;
  thursday: BusinessDay;
  friday: BusinessDay;
  saturday: BusinessDay;
  sunday: BusinessDay;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  restaurant_id: string;
  image_url?: string;
  category?: string;
  available: boolean;
  created_at: string;
  dietary_preferences?: string[];
  cuisine_type?: string;
  
  // Propriétés supplémentaires
  popularity_score?: number;
  preparation_time?: number;
  ingredients?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  profit_margin?: number;
  nutritional_info?: {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
    sodium: number;
    fiber: number;
  };
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: string;
    discount_value: number;
    start_date?: string;
    end_date?: string;
  };
  customization_options?: MenuCustomizationOption[];
  nutritional_score?: number;
  average_rating?: number;
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  min_selections?: number;
  max_selections?: number;
  values: {
    id: string;
    name: string;
    price: number;
    default?: boolean;
  }[];
}

export interface CustomizationOption {
  required: boolean;
  multiple: boolean;
  values: {
    name: string;
    price: number;
    default?: boolean;
  }[];
}

export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery';
  discount_value: number;
  active: boolean;
  conditions?: {
    min_order_value?: number;
    applicable_items?: string[];
    max_uses_per_customer?: number;
  };
  
  // Propriétés supplémentaires
  valid_from?: string;
  valid_to?: string;
  promotion_hours?: {
    start: string;
    end: string;
  };
  min_order_value?: number;
  menu_item_ids?: string[];
  coupon_code?: string;
}

export interface Table {
  id: string;
  table_number: string;
  capacity: number;
  minimum_guests: number;
  maximum_guests: number;
  location?: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  is_accessible: boolean;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  table_id: string;
  user_id: string;
  party_size: number;
  reservation_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  special_requests?: string;
}

export type RestaurantViewMode = 'grid' | 'list' | 'map';

export interface RestaurantFilters {
  search?: string;
  sort_by?: 'rating' | 'distance' | 'price' | 'name';
  price_level?: string[];
  category?: string[];
  open_now?: boolean;
  dietary?: string[];
  services?: string[];
  
  // Propriétés supplémentaires
  cuisine_type?: string | string[];
  rating?: number;
  distance?: number;
  isOpen?: boolean;
  hasDelivery?: boolean;
  hasPickup?: boolean;
}

export interface RestaurantDetails extends Restaurant {
  menu_categories: string[];
  popular_items: MenuItem[];
  reviews: any[];
  special_offers: any[];
}
