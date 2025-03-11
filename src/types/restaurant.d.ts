
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  status: "open" | "closed" | "busy";
  average_prep_time: number; 
  banner_image_url?: string;
  logo_url?: string;
  cuisine_type: string;
  rating?: number;
  total_ratings: number;
  minimum_order: number;
  delivery_fee: number;
  business_hours: BusinessHours;
  special_days?: string[];
  distance?: number;
  menu_items?: MenuItem[];
  trending?: boolean;
}

export interface BusinessHours {
  regular: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  special?: {
    date: string;
    hours: {
      open: string;
      close: string;
    };
  }[];
}

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
  updated_at: string;
  ingredients?: string[];
  rating?: number;
  preparation_time?: number;
  dietary_preferences?: string[];
  customization_options?: Record<string, any>;
  nutritional_info?: {
    calories?: number | null;
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
    fiber?: number | null;
  };
  allergens?: string[];
  popularity_score?: number;
}
