
import { MenuCustomizationOption, MenuPromotion, MenuStatistics, MenuRecommendation, MenuAnalysisResult } from './restaurant';

export { MenuCustomizationOption, MenuPromotion, MenuStatistics, MenuRecommendation, MenuAnalysisResult };

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  restaurant_id: string;
  display_order?: number;
  active?: boolean;
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
  customization_options?: MenuCustomizationOption[];
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
  nutritional_score?: number;
  allergens?: string[];
  ingredients?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  preparation_time?: number;
  profit_margin?: number;
  average_rating?: number;
  promotional_data?: {
    is_on_promotion?: boolean;
    discount_percentage?: number;
    promotion_hours?: unknown;
    original_price?: number;
    discount_type?: string;
    discount_value?: number;
  };
}

export { MenuItem as MenuItemType };
