
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category: string;
  restaurant_id: string;
  available: boolean;
  created_at: string;
  updated_at?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
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
  allergens?: string[];
  ingredients?: string[];
  dietary_preferences?: string[];
  is_combo?: boolean;
  customization_options?: MenuCustomizationOption[];
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: string;
    discount_value: number;
    start_date?: string;
    end_date?: string;
  };
  featured?: boolean;
  stock_level?: number;
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  required: boolean;
  min_selections: number;
  max_selections: number;
  options: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface MenuCategory {
  id: string;
  name: string;
  restaurant_id: string;
  order?: number;
  items?: MenuItem[];
}

export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery';
  discount_value: number;
  start_date: string;
  end_date: string;
  validity_days: {
    days: string[];
    start_time: string;
    end_time: string;
  };
  conditions: {
    min_order_value?: number;
    applicable_items?: string[];
    max_uses_per_customer?: number;
  };
  title?: string;
  description?: string;
  active: boolean;
}

export type PromotionWithRestaurant = MenuPromotion & {
  restaurant: {
    id: string;
    name: string;
    image_url?: string;
  }
};

export interface MenuAnalysisResult {
  totalItems: number;
  categoryBreakdown: {
    [category: string]: number;
  };
  priceStats: {
    average: number;
    min: number;
    max: number;
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
  mostPopularCategory?: string;
  menuSuggestions: Array<{
    type: string;
    message: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}
