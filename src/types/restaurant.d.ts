
export type BusinessDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface BusinessHours {
  monday: { open: string; close: string; is_closed: boolean };
  tuesday: { open: string; close: string; is_closed: boolean };
  wednesday: { open: string; close: string; is_closed: boolean };
  thursday: { open: string; close: string; is_closed: boolean };
  friday: { open: string; close: string; is_closed: boolean };
  saturday: { open: string; close: string; is_closed: boolean };
  sunday: { open: string; close: string; is_closed: boolean };
}

export interface PriceRange {
  min: number;
  max: number;
  currency?: string;
}

export type RestaurantViewMode = 'grid' | 'list' | 'map';

export interface RestaurantFilters {
  open_now?: boolean;
  sort_by?: 'distance' | 'popularity' | 'rating' | 'price';
  price_range?: number[];
  categories?: string[];
  cuisine_type?: string | string[];
  distance?: number;
  rating?: number;
  search?: string;
  has_delivery?: boolean;
  has_pickup?: boolean;
  dietary_options?: string[];
  isOpen?: boolean;
  hasDelivery?: boolean;
  hasPickup?: boolean;
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
  cuisine_type?: string;
  banner_image_url?: string;
  logo_url?: string;
  created_at: string;
  rating?: number;
  average_rating?: number;
  total_ratings?: number;
  business_hours?: BusinessHours;
  featured?: boolean;
  trending?: boolean;
  delivery_fee?: number;
  min_order?: number;
  delivery_radius?: number;
  estimated_preparation_time?: number;
  average_prep_time?: number;
  is_open?: boolean;
  status?: string;
  payment_methods?: string[];
  specialties?: string[];
  services?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  restaurant_id: string;
  price: number;
  available: boolean;
  category: string;
  image_url?: string;
  created_at: string;
  popularity_score?: number;
  dietary_preferences?: string[];
  cuisine_type?: string;
  description?: string;
  customization_options?: MenuCustomizationOption[];
  ingredients?: string[];
  nutritional_info?: {
    calories?: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
  };
  stock_level?: number;
  preparation_time?: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  is_combo?: boolean;
  featured?: boolean;
  profit_margin?: number;
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: string;
    discount_value: number;
  };
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  values: {
    id: string;
    name: string;
    price: number;
    default?: boolean;
  }[];
}

export interface Table {
  id: string;
  restaurant_id: string;
  capacity: number;
  status: string;
  is_available?: boolean;
  minimum_guests?: number;
  maximum_guests?: number;
  notes?: string;
  table_number: string;
  location?: string;
}

export interface RestaurantDetails extends Restaurant {
  menu_categories: string[];
  popular_items: MenuItem[];
  reviews: any[];
  special_offers: any[];
  min_order: number;
}

export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'free_item';
  discount_value: number;
  active: boolean;
  start_date?: string;
  end_date?: string;
  code?: string;
  min_order_value?: number;
  menu_item_ids?: string[];
  valid_from?: string;
  valid_to?: string;
  promotion_hours?: any;
  is_active?: boolean;
  coupon_code?: string;
}

export interface MenuStatistics {
  total_items?: number;
  total_orders?: number;
  popular_categories?: Record<string, number>;
  average_order_value?: number;
  totalItems?: number;
}

export interface MenuRecommendation {
  item_id?: string;
  reason?: string;
  confidence?: number;
  type?: string;
}

export interface MenuAnalysisResult {
  statistics: MenuStatistics;
  recommendations: MenuRecommendation[];
  mostPopularCategory?: string;
}
