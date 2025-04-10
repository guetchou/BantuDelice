
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
  cuisine_type?: string;
  rating?: number;
  average_rating?: number;
  banner_image_url?: string;
  logo_url?: string;
  business_hours?: BusinessHours;
  special_hours?: { [date: string]: BusinessDay };
  delivery_fee?: number;
  min_order?: number;
  minimum_order?: number; // Deprecated, use min_order instead
  is_open?: boolean;
  status?: string;
  featured?: boolean;
  trending?: boolean;
  categories?: string[];
  special_features?: string[];
  delivery_time?: number;
  user_id?: string;
  created_at?: string;
  price_range?: PriceRange;
  estimated_delivery_time?: number;
}

export interface PriceRange {
  min: number;
  max: number;
  currency?: string;
}

export interface BusinessHours {
  monday: BusinessDay;
  tuesday: BusinessDay;
  wednesday: BusinessDay;
  thursday: BusinessDay;
  friday: BusinessDay;
  saturday: BusinessDay;
  sunday: BusinessDay;
  regular?: {
    monday: { open: string; close: string; is_closed: boolean };
    tuesday: { open: string; close: string; is_closed: boolean };
    wednesday: { open: string; close: string; is_closed: boolean };
    thursday: { open: string; close: string; is_closed: boolean };
    friday: { open: string; close: string; is_closed: boolean };
    saturday: { open: string; close: string; is_closed: boolean };
    sunday: { open: string; close: string; is_closed: boolean };
  };
}

export interface BusinessDay {
  open: string;
  close: string;
  is_closed: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  restaurant_id: string;
  category: string;
  image_url?: string;
  available: boolean;
  created_at: string;
  dietary_preferences?: string[];
  customization_options?: Record<string, CustomizationOption>;
  popularity_score?: number;
  cuisine_type?: string;
  stock_level?: number;
  featured?: boolean;
  is_combo?: boolean;
  preparation_time?: number;
  nutritional_info?: {
    calories?: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
  };
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: string;
    discount_value: number;
  };
  profit_margin?: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
}

export interface CustomizationOption {
  required?: boolean;
  multiple?: boolean;
  default?: string;
  values?: { value: string; price: number }[];
}

export interface RestaurantFilters {
  search?: string;
  categories?: string[];
  min_rating?: number;
  price_range?: [number, number];
  sort_by?: string;
  open_now?: boolean;
  cuisine_type?: string;
  sortBy?: string; // Deprecated, use sort_by instead
  cuisine?: string; // Deprecated, use cuisine_type instead
  isOpen?: boolean; // Deprecated, use open_now instead
  hasDelivery?: boolean;
  hasPickup?: boolean;
}

export interface RestaurantDetails extends Restaurant {
  menu_categories: { name: string; items: MenuItem[] }[];
  popular_items: MenuItem[];
  reviews: any[];
  special_offers: any[];
  min_order: number;
}

export interface Table {
  id: string;
  restaurant_id: string;
  capacity: number;
  is_available: boolean;
  table_number: string;
  location?: string;
  status: string;
  minimum_guests?: number;
  maximum_guests?: number;
  is_accessible?: boolean;
  notes?: string;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  table_id: string;
  user_id: string;
  reservation_date: string;
  party_size: number;
  status: string;
  notes?: string;
}

export interface RestaurantPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'free_item';
  discount_value: number;
  min_order_value?: number;
  conditions?: string[];
  active: boolean;
  start_date?: string;
  end_date?: string;
  promotion_hours?: {
    days: string[];
    start_time: string;
    end_time: string;
  };
  coupon_code?: string;
}

export type RestaurantPromotionInsert = Omit<RestaurantPromotion, 'id'>;

// Menu related types
export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'free_item';
  discount_value: number;
  min_order_value?: number;
  active: boolean;
  valid_from?: string;
  valid_to?: string;
  promotion_hours?: {
    days: string[];
    start_time: string;
    end_time: string;
  };
  menu_item_ids?: string[];
  conditions: {
    min_order_value?: number;
    applicable_items?: string[];
    max_uses_per_customer?: number;
  };
}

export interface MenuStatistics {
  mostOrderedItems: MenuItem[];
  leastOrderedItems: MenuItem[];
  mostProfitableItems: MenuItem[];
  itemsWithHighRating: MenuItem[];
  itemsWithLowRating: MenuItem[];
  mostPopularCategory?: string;
  totalItems?: number;
}

export interface MenuRecommendation {
  item: MenuItem;
  reason: string;
  action: string;
  impact: {
    revenue?: number;
    orders?: number;
  };
  type?: string;
}
