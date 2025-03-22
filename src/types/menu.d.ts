
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
