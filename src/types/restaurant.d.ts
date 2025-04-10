
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
  created_at: string;
  min_order: number;
  delivery_fee: number;
  rating?: number;
  average_rating?: number;
  total_ratings?: number;
  trending?: boolean;
  average_prep_time?: number;
  features?: string[];
  special_features?: string[];
  payment_methods?: string[];
  is_open?: boolean;
  status?: string;
  price_range?: {
    min: number;
    max: number;
    currency?: string;
  };
  business_hours: BusinessHours;
}

export type BusinessDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusinessHours {
  monday: { open: string; close: string; is_closed?: boolean };
  tuesday: { open: string; close: string; is_closed?: boolean };
  wednesday: { open: string; close: string; is_closed?: boolean };
  thursday: { open: string; close: string; is_closed?: boolean };
  friday: { open: string; close: string; is_closed?: boolean };
  saturday: { open: string; close: string; is_closed?: boolean };
  sunday: { open: string; close: string; is_closed?: boolean };
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

export interface RestaurantDetails extends Restaurant {
  menu_categories: string[];
  popular_items: MenuItem[];
  reviews: RestaurantReview[];
  special_offers: RestaurantPromotion[];
}

export interface RestaurantReview {
  id: string;
  user_id: string;
  restaurant_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
}

export interface RestaurantPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery';
  discount_value: number;
  min_order_value?: number;
  start_date: string;
  end_date: string;
  active: boolean;
  conditions?: string[];
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
  created_at: string;
  dietary_preferences?: string[];
  cuisine_type?: string;
  customization_options?: MenuCustomizationOption[];
  popularity_score?: number;
  preparation_time?: number;
  nutritional_info?: {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
    sodium: number;
    fiber: number;
  };
  nutritional_score?: number;
  profit_margin?: number;
  is_combo?: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  ingredients?: string[];
  stock_level?: number;
  featured?: boolean;
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: string;
    discount_value: number;
    start_date?: string;
    end_date?: string;
  };
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  max_selections?: number;
  values: {
    id: string;
    name: string;
    price: number;
    default?: boolean;
  }[];
}

export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date: string;
  active: boolean;
  title: string;
  description?: string;
  valid_from?: string;
  valid_to?: string;
  promotion_hours?: {
    start: string;
    end: string;
    days: string[];
  };
  conditions: {
    min_order_value?: number;
    applicable_items?: string[];
    max_uses_per_customer?: number;
  };
  menu_item_ids?: string[];
  coupon_code?: string;
}

export interface MenuAnalysisResult {
  popularItems: MenuItem[];
  lowPerformingItems: MenuItem[];
  trendingCategories: { category: string; count: number }[];
  mostPopularCategory?: string;
  profitability: {
    highProfitItems: MenuItem[];
    lowProfitItems: MenuItem[];
  };
}

export interface MenuRecommendation {
  id: string;
  type: 'price_change' | 'promotion' | 'removal' | 'featured';
  item_id: string;
  reason: string;
  expected_impact: string;
  current_value: number;
  recommended_value: number;
  priority: 'high' | 'medium' | 'low';
}

export interface RestaurantFilters {
  cuisine_type?: string | string[];
  price_range?: { min: number; max: number };
  rating?: number;
  open_now?: boolean;
  distance?: number;
  sort_by?: 'distance' | 'rating' | 'price_low' | 'price_high' | 'popularity';
  isOpen?: boolean;
  hasDelivery?: boolean;
  hasPickup?: boolean;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  location?: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  is_available?: boolean;
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests?: string;
}

export type RestaurantViewMode = 'grid' | 'list' | 'map';
