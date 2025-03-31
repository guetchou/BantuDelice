
export type BusinessDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusinessHours {
  [key in BusinessDay]: {
    open: string;
    close: string;
    is_closed?: boolean;
  };
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
  cuisine_type: string;
  price_range: string;
  rating: number;
  delivery_fee?: number;
  delivery_time?: number;
  min_order?: number;
  business_hours: BusinessHours;
  status: 'open' | 'closed' | 'busy';
  owner_id?: string;
  featured?: boolean;
  average_rating?: number;
  is_open?: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  available: boolean;
  dietary_preferences?: string[];
  cuisine_type?: string;
  preparation_time?: number;
  ingredients?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  nutritional_score?: number;
  profit_margin?: number;
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: string;
    discount_value: number;
    start_date?: string;
    end_date?: string;
  };
}

export interface RestaurantFilters {
  search?: string;
  sort_by?: 'rating' | 'price' | 'distance' | 'delivery_time';
  sort_direction?: 'asc' | 'desc';
  price_range?: string[];
  dietary?: string[];
  open_now?: boolean;
  delivery_only?: boolean;
  pickup_only?: boolean;
  min_rating?: number;
  max_distance?: number;
  cuisine_type?: string;
  isOpen?: boolean;
  hasDelivery?: boolean;
  hasPickup?: boolean;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: number;
  capacity: number;
  minimum_guests?: number;
  maximum_guests?: number;
  is_available?: boolean;
  location: string;
  notes?: string;
}

export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  active: boolean;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'free_item';
  discount_value: number;
  valid_from?: string;
  valid_to?: string;
  promotion_hours?: {
    start_time: string;
    end_time: string;
    days: string[];
  };
  conditions: {
    min_order_value?: number;
    applicable_items?: string[];
    max_uses_per_customer?: number;
  };
  coupon_code?: string;
}

export interface PromotionWithRestaurant extends MenuPromotion {
  restaurant_name: string;
  restaurant_logo?: string;
  restaurant_cuisine?: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  end_date: string;
}
