
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  price_range: number;
  cuisine_type?: string;
  rating?: number;
  average_rating?: number;
  is_open?: boolean;
  opening_hours?: any;
  business_hours?: any;
  delivery_fee?: number;
  minimum_order?: number;
  estimated_delivery_time?: number;
  estimated_preparation_time?: number;
  average_prep_time?: number;
  image_url?: string;
  logo_url?: string;
  banner_url?: string;
  banner_image_url?: string;
  features?: string[];
  created_at?: string;
  updated_at?: string;
  status?: 'pending' | 'approved' | 'suspended';
  distance?: number;
  trending?: boolean;
  latitude?: number;
  longitude?: number;
  review_count?: number;
  delivery_time?: number;
  menu_items?: MenuItem[];
  total_ratings?: number;
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
  ingredients?: string[];
  dietary_preferences?: string[];
  nutrition_info?: any;
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  customization_options?: any[];
  stock_level?: number;
  stock?: number;
  popularity_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface MenuPromotion {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  discount_amount?: number;
  discount_type?: string;
  discount_value?: number;
  start_date: string;
  end_date: string;
  valid_from?: string;
  valid_to?: string;
  active: boolean;
  restaurant_id: string;
  menu_item_ids?: string[];
  promotion_hours?: any;
  conditions?: any;
  min_order_value?: number;
}

export interface MenuStatistics {
  popularItems: MenuItem[];
  profitMargins: Array<{
    itemId: string;
    margin?: number;
  }>;
  salesTrends: any[];
  categoryPerformance: any[];
  timeBasedAnalysis: any[];
}

export interface MenuAnalysisResult {
  totalItems: number;
  priceStats: {
    average: number;
    highest: number;
    lowest: number;
    median: number;
  };
  dietaryOptions: {
    vegetarianCount: number;
    veganCount: number;
    glutenFreeCount: number;
    vegetarianPercentage: number;
    veganPercentage: number;
    glutenFreePercentage: number;
  };
  menuSuggestions: Array<{
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface MenuRecommendation {
  id?: string;
  recommendationType: string;
  strength: string;
}
