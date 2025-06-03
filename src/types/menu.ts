
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
  nutrition_info?: any;
  customization_options?: any[];
  stock_level?: number;
  created_at?: string;
  updated_at?: string;
}
