
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
  total_ratings?: number;
  is_open?: boolean;
  opening_hours?: BusinessHours;
  business_hours?: BusinessHours;
  delivery_fee?: number;
  minimum_order?: number;
  estimated_delivery_time?: number;
  estimated_preparation_time: number;
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
  latitude?: number;
  longitude?: number;
  trending?: boolean;
  menu_items?: MenuItem[];
}

export interface BusinessHours {
  regular?: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  special?: Array<{
    date: string;
    open?: string;
    close?: string;
    closed: boolean;
  }>;
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
