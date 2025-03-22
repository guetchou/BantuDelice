
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
  updated_at?: string;
  
  // Additional properties for our enhanced menu system
  preparation_time?: number;
  ingredients?: string[];
  allergens?: string[];
  
  // Dietary preferences
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  
  // Nutrition information
  nutritional_info?: {
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    fiber: number | null;
  };
  
  // Business intelligence metrics
  popularity_score?: number;
  profit_margin?: number;
  cost_price?: number;
  waste_percentage?: number;
  
  // Marketing and promotion
  featured?: boolean;
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: 'percentage' | 'fixed_amount' | 'buy_one_get_one';
    discount_value: number;
    start_date?: string;
    end_date?: string;
  };
  
  // Advanced attributes for recommendations
  pairs_well_with?: string[];
  recommended_drinks?: string[];
  seasonal_availability?: 'all_year' | 'summer' | 'winter' | 'fall' | 'spring';
  
  // Customization options
  customization_options?: {
    spice_level?: ('mild' | 'medium' | 'hot' | 'extra_hot')[];
    toppings?: {id: string; name: string; price: number}[];
    sides?: {id: string; name: string; price: number}[];
    size_options?: {id: string; name: string; price_adjustment: number}[];
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  restaurant_id: string;
  display_order?: number;
  is_active?: boolean;
}

export interface MenuFilter {
  category?: string;
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    spicy?: boolean;
  };
  price?: {
    min?: number;
    max?: number;
  };
  searchQuery?: string;
  sortBy?: 'name' | 'price' | 'popularity' | 'preparation_time';
  sortOrder?: 'asc' | 'desc';
}

export interface MenuStatistics {
  totalItems: number;
  categoryCounts: Record<string, number>;
  averagePrice: number;
  averagePrepTime: number;
  mostPopularCategory: string;
  mostPopularItem: string;
  highestMarginItem: string;
  vegetarianCount: number;
  veganCount: number;
  glutenFreeCount: number;
}

export interface MenuRecommendation {
  type: 'add' | 'remove' | 'modify' | 'price';
  item?: MenuItem;
  itemId?: string;
  itemName?: string;
  reason: string;
  impact: string;
  confidence: 'high' | 'medium' | 'low';
  details?: string;
}
