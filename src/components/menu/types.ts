export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category?: string;
  image_url?: string | null;
  restaurant_id?: string;
  available?: boolean;
  customization_options?: Record<string, any>;
  dietary_preferences?: string[];
  cuisine_type?: string;
  popularity_score?: number;
}

export interface MenuItemVariation {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  portion_size?: string;
  serves?: number;
  spicy_level?: number;
  description?: string;
}

export interface MenuItemCustomization {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
    price?: number;
  }[];
  required?: boolean;
  multiple?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuFilter {
  category?: string;
  price_range?: [number, number];
  dietary_preferences?: string[];
  cuisine_type?: string;
  spicy_level?: number;
  available_only?: boolean;
}

// Types for menu item recommendations
export interface MenuItemRecommendation {
  item_id: string;
  score: number;
  reason: string;
}

// Types for menu item reviews/ratings
export interface MenuItemRating {
  id: string;
  user_id: string;
  menu_item_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}