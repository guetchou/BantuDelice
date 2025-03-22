export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category: string;
  restaurant_id: string;
  available: boolean;
  ingredients?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  allergens?: string[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  preparation_time?: number;
  popularity_score?: number;
  pairs_well_with?: string[];
  nutritional_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuAnalytics {
  totalItems: number;
  categories: Record<string, number>;
  mostPopularCategory: string;
  priceStats: {
    average: number;
    min: number;
    max: number;
    range: number;
  };
  dietaryOptions: {
    vegetarianPercentage: number;
    veganPercentage: number;
    glutenFreePercentage: number;
  };
  menuSuggestions?: Array<{
    type: string;
    message: string;
    importance: 'low' | 'medium' | 'high';
  }>;
}

export interface MenuFilter {
  categories: string[];
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  priceRange: {
    min: number | undefined;
    max: number | undefined;
  };
  keyword: string;
  includeUnavailable: boolean;
}

export interface MenuSuggestion {
  type: string;
  message: string;
  importance: 'low' | 'medium' | 'high';
}

export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery';
  discount_value: number;
  min_order_amount: number;
  start_date: string;
  end_date: string;
  applied_to: 'menu_item' | 'category' | 'all';
  target_id?: string;
  created_at: string;
}

export interface MenuStatistics {
  total_items: number;
  categories_distribution: Record<string, number>;
  price_points: {
    average: number;
    min: number;
    max: number;
    median: number;
  };
  dietary_options: {
    vegetarian_count: number;
    vegan_count: number;
    gluten_free_count: number;
  };
}

export interface MenuRecommendation {
  id: string;
  menu_item_id: string;
  recommendation_type: 'similar' | 'popular' | 'promotion' | 'upsell';
  score: number;
  reason?: string;
}
