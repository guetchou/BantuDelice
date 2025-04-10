
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  cuisine_type: string;
  banner_image_url: string;
  logo_url: string;
  rating: number;
  average_rating: number;
  min_order: number;
  delivery_fee: number;
  is_open: boolean;
  created_at: string;
  specialties?: string[];
  status?: string;
  business_hours: BusinessHours;
  opening_hours?: any;
  payment_methods?: string[];
  services?: string[];
  tags?: string[];
  features?: string[];
  trending?: boolean;
  average_prep_time?: number;
  total_ratings?: number;
  special_features?: string[];
  estimated_delivery_time?: string;
}

export interface BusinessHours {
  monday: { open: string; close: string; is_closed?: boolean };
  tuesday: { open: string; close: string; is_closed?: boolean };
  wednesday: { open: string; close: string; is_closed?: boolean };
  thursday: { open: string; close: string; is_closed?: boolean };
  friday: { open: string; close: string; is_closed?: boolean };
  saturday: { open: string; close: string; is_closed?: boolean };
  sunday: { open: string; close: string; is_closed?: boolean };
  regular?: { [key: string]: { open: string; close: string; is_closed?: boolean } };
}

export type BusinessDay = keyof BusinessHours;

export interface RestaurantFilters {
  sort_by?: string;
  search?: string;
  open_now?: boolean;
  price_range?: [number, number];
  category?: string | string[];
  cuisine?: string | string[];
  distance?: number;
  rating?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  restaurant_id: string;
  available: boolean;
  created_at: string;
  dietary_preferences?: string[];
  customization_options?: Record<string, CustomizationOption>;
  popularity_score?: number;
  cuisine_type?: string;
  nutritional_score?: number;
}

export interface CustomizationOption {
  required?: boolean;
  multiple?: boolean;
  default?: string;
  values: {
    value: string;
    price: number;
  }[];
}

export interface MenuPromotion {
  id: string;
  name: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery';
  discount_value: number;
  start_date?: string;
  end_date?: string;
  conditions?: any;
  active: boolean;
  menu_item_ids?: string[];
  valid_from?: string;
  valid_to?: string;
  promotion_hours?: any;
  min_order_value?: number;
  coupon_code?: string;
}
