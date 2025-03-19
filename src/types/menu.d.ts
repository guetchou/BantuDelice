
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
  restaurant_id: string;
  created_at: string;
  updated_at?: string;
  customization_options?: Record<string, any>;
  popularity_score?: number;
  rating?: number;
  preparation_time?: number;
  dietary_preferences?: string[];
  cuisine_type?: string;
  ingredients?: string[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  allergens?: string[];
  is_available?: boolean;
  stock_level?: number;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
