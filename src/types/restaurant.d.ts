
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  banner_image_url?: string;
  cuisine_type?: string;
  min_order?: number;
  delivery_fee?: number;
  business_hours?: BusinessHours;
  rating?: number;
  average_rating?: number;
  status?: string;
  is_open?: boolean;
  services?: string[];
  features?: string[];
  special_features?: string[];
  opening_hours?: BusinessHours;
  price_range?: any;
  estimated_delivery_time?: number | string;
  trending?: boolean;
  restaurant_id?: string;
  user_id?: string;
  created_at?: string;
  average_prep_time?: number;
  total_ratings?: number;
  payment_methods?: string[];
  minimum_order?: number;
}

export interface BusinessHours {
  monday?: {
    open: string;
    close: string;
  };
  tuesday?: {
    open: string;
    close: string;
  };
  wednesday?: {
    open: string;
    close: string;
  };
  thursday?: {
    open: string;
    close: string;
  };
  friday?: {
    open: string;
    close: string;
  };
  saturday?: {
    open: string;
    close: string;
  };
  sunday?: {
    open: string;
    close: string;
  };
  regular?: {
    monday?: { open: string; close: string; is_closed?: boolean };
    tuesday?: { open: string; close: string; is_closed?: boolean };
    wednesday?: { open: string; close: string; is_closed?: boolean };
    thursday?: { open: string; close: string; is_closed?: boolean };
    friday?: { open: string; close: string; is_closed?: boolean };
    saturday?: { open: string; close: string; is_closed?: boolean };
    sunday?: { open: string; close: string; is_closed?: boolean };
  };
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  required: boolean;
  multiple?: boolean;
  values: {
    value: string;
    price?: number;
    default?: boolean;
  }[];
}

export interface MenuPromotion {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_item';
  discount_value: number;
  valid_from: string;
  valid_to: string;
  promotion_hours?: {
    days: string[];
    start: string;
    end: string;
  };
  conditions?: string[];
  min_order_value?: number;
  restaurant_id: string;
}

export interface MenuStatistics {
  popularItems: any[];
  profitMargins: any[];
  salesTrends: any[];
  categoryPerformance: any[];
  timeBasedAnalysis: any[];
}

export interface MenuRecommendation {
  id: string;
  itemId: string;
  recommendedItemId: string;
  recommendationType: string;
  strength: number;
}

export interface MenuAnalysisResult {
  lowProfitItems: any[];
  highProfitItems: any[];
  slowMovers: any[];
  fastMovers: any[];
  priceChangeRecommendations: any[];
  bundleOpportunities: any[];
  seasonalRecommendations: any[];
  mostPopularCategory?: string;
}

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  status: string;
  location: string;
  is_available?: boolean;
  minimum_guests?: number;
  maximum_guests?: number;
  table_number?: string;
  is_accessible?: boolean;
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  restaurant_id: string;
  available: boolean;
  created_at: string;
  dietary_preferences?: string[];
  customization_options?: Record<string, any> | MenuCustomizationOption[];
  popularity_score?: number;
  featured?: boolean;
  stock_level?: number;
  nutritional_info?: {
    calories?: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
    protein?: number;
    fat?: number;
    fiber?: number;
  };
  is_combo?: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  preparation_time?: number;
  allergens?: string[];
  ingredients?: string[];
  nutritional_score?: number;
  average_rating?: number;
  promotional_data?: {
    is_on_promotion?: boolean;
    discount_percentage?: number;
    promotion_hours?: any;
    original_price?: number;
    discount_type?: string;
    discount_value?: number;
  };
}

export interface RestaurantFilters {
  cuisine?: string[];
  rating?: number;
  priceRange?: [number, number];
  deliveryTime?: number;
  openNow?: boolean;
  search?: string;
}
