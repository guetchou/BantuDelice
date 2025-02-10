
export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url?: string | null;
  restaurant_id?: string;
  available: boolean;
  customization_options: Record<string, any>;
  dietary_preferences?: string[];
  cuisine_type?: string;
  popularity_score?: number;
  rating?: number;
  preparation_time?: number;
  allergens?: string[];
  calories?: number;
  ingredients?: string[];
  seasonal?: boolean;
  featured?: boolean;
  quantity?: number;
  inventory_levels?: {
    current_stock: number;
    reserved_stock: number;
  }[];
  nutritional_info?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  spiciness_level?: 'mild' | 'medium' | 'hot' | 'very-hot';
  preparation_method?: string;
  portion_size?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  contains_nuts?: boolean;
  contains_dairy?: boolean;
  is_halal?: boolean;
  is_kosher?: boolean;
}
