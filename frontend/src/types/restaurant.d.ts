export interface Restaurant {
  id: string;
  name: string;
  address: string;
  description: string;
  phone: string;
  status: string;
  cuisine_type?: string | string[];
  logo_url?: string;
  banner_url?: string;
  rating?: number;
  delivery_time?: number;
  delivery_fee?: number;
  minimum_order?: number;
  is_open?: boolean;
  opening_hours?: BusinessHours;
  categories?: MenuCategory[];
  menu_items?: MenuItem[];
  location?: {
    latitude: number;
    longitude: number;
  };
  banner_image_url?: string;
  average_rating?: number;
  average_prep_time?: number;
  price_range?: number;
  total_ratings?: number;
  trending?: boolean;
  business_hours?: unknown;
  website?: string;
  special_features?: string[];
  payment_methods?: string[];
  estimated_delivery_time?: number;
  min_order?: number;
  available?: boolean;
  is_available?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Table {
  id: string;
  tableNumber: string;
  location: string;
  capacity: number;
  minimum_guests: number;
  maximum_guests: number;
  is_available?: boolean;
  is_accessible?: boolean;
  notes?: string;
}

export interface BusinessHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: string;
  category_name?: string;
  restaurant_id?: string;
  is_available?: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  allergens?: string[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  preparation_time?: number;
  options?: MenuItemOption[];
  variations?: MenuItemVariation[];
  popular?: boolean;
  spicy_level?: number;
  tags?: string[];
  category?: string;
  dietary_preferences?: string[];
  customization_options?: unknown[];
  ingredients?: string[];
  stock?: number;
  available?: boolean;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  popularity_score?: number;
}

export interface MenuItemOption {
  id: string;
  name: string;
  required?: boolean;
  multiple?: boolean;
  min_selections?: number;
  max_selections?: number;
  choices: MenuItemOptionChoice[];
}

export interface MenuItemOptionChoice {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface MenuItemVariation {
  id: string;
  name: string;
  price: number;
  is_available?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export interface MenuCustomizationOption {
  name: string;
  values: string[];
  required?: boolean;
  multiple?: boolean;
  min_selections?: number;
  max_selections?: number;
  choices?: { name: string; price: number }[];
}

export type MenuPromotion = {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  title: string;
  discount_type: 'percentage' | 'amount' | 'fixed_amount';
  discount_value: number;
  valid_from: string;
  valid_to: string;
  promotion_hours?: { start: string; end: string; days?: string[] }[];
  conditions?: string;
  min_order_value?: number;
};

export type MenuStatistics = {
  totalItems: number;
  priceStats: {
    average: number;
    highest: number;
    lowest: number;
    median: number; // Added median
  };
  dietaryOptions: {
    vegetarianCount: number;
    vegetarianPercentage: number;
    veganCount: number; // Added veganCount
  };
  menuSuggestions: Array<{ message: string; priority: 'high' | 'medium' | 'low' }>;
};

export type MenuRecommendation = {
  id?: string;
  recommendationType: string;
  strength: string;
};

export type MenuAnalysisResult = {
  score: number;
  insights: string[];
  lowProfitItems?: MenuItem[];
  highProfitItems?: MenuItem[];
  slowMovers?: MenuItem[];
  fastMovers?: MenuItem[];
  priceChangeRecommendations?: Array<{ itemId: string; suggestedPrice: number }>;
  totalItems: number;
  priceStats: {
    average: number;
    highest: number;
    lowest: number;
    median: number; // Added median
  };
  dietaryOptions: {
    vegetarianCount: number;
    vegetarianPercentage: number;
    veganCount: number; // Added veganCount
  };
  menuSuggestions: Array<{ message: string; priority: 'high' | 'medium' | 'low' }>;
};

export interface RestaurantFilters {
  cuisine?: string[];
  rating?: number;
  priceRange?: [number, number]; // Changed from price_range to priceRange
  openNow?: boolean;
  search?: string;
  distance?: number;
  isOpen?: boolean;
  hasDelivery?: boolean;
  hasPickup?: boolean;
}

export interface RidesharingTrip {
  id: string;
  description: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  origin_address?: string;
  destination_address?: string;
  departure_time?: string;
  estimated_arrival_time?: string;
  available_seats?: number;
  price_per_seat?: number;
  vehicle_model?: string;
  vehicle_color?: string;
  license_plate?: string;
  preferences?: {
    smoking_allowed: boolean;
    pets_allowed: boolean;
    music_allowed: boolean;
    air_conditioning: boolean;
    luggage_allowed: boolean;
    chatty_driver?: boolean;
  };
  recurrence_pattern?: {
    frequency: string;
    days_of_week?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  };
  status?: string;
}
