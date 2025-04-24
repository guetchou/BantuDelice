
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  restaurant_id: string;
  available: boolean;
  created_at: string;
  dietary_preferences?: string[];
  preparation_time?: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  ingredients?: string[];
  popularity_score?: number;
  customization_options?: MenuCustomizationOption[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sodium?: number;
  };
  portion_size?: string;
  promotional_data?: {
    is_on_promotion?: boolean;
    discount_percentage?: number;
    promotion_hours?: any;
    original_price?: number;
  };
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  type: 'radio' | 'checkbox';
  required: boolean;
  max_selections?: number;
  options: {
    id: string;
    name: string;
    price?: number;
    default?: boolean;
  }[];
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  image_url?: string;
  banner_image_url?: string;
  logo_url?: string;
  description: string;
  phone: string;
  email?: string;
  cuisine_type?: string;
  rating?: number;
  average_rating?: number;
  is_open?: boolean;
  delivery_fee?: number;
  min_order_amount?: number;
  estimated_preparation_time: number;
  distance?: number;
  menu_items?: MenuItem[];
  latitude?: number;
  longitude?: number;
  business_hours?: BusinessHours;
  features?: string[];
  services?: string[];
  payment_methods?: string[];
}

export interface BusinessHours {
  regular: Record<string, { open: string; close: string }>;
  special?: Record<string, { open: string; close: string }>;
  holidays?: string[];
}

export interface MenuAnalysisResult {
  totalItems: number;
  totalCategories?: number;
  mostPopularCategory?: string;
  priceStats: {
    average: number;
    highest: number;
    lowest: number;
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
  menuSuggestions: {
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  categoryBreakdown?: Record<string, number>;
  priceDistribution?: {
    lowPriced: number;
    mediumPriced: number;
    highPriced: number;
  };
  missingPhotos?: number;
}

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  minimum_guests?: number;
  maximum_guests?: number;
  is_available?: boolean;
  is_accessible?: boolean;
  location?: string;
  status?: string;
  notes?: string;
}

export interface RidesharingTrip {
  id: string;
  driver_id?: string;
  origin: string;
  destination: string;
  departure_time: string;
  seats_available: number;
  price: number;
  status: string;
  vehicle_type: string;
  description?: string;
}

export type ApiResponse<T> = T;
