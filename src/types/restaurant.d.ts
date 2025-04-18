
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  banner_image_url?: string;
  cuisine_type?: string;
  min_order?: number;
  delivery_fee?: number;
  business_hours?: BusinessHours;
  rating?: number;
  average_rating?: number;
  status?: string;
  is_open?: boolean;
  services?: string[];
  features?: string[];
  special_features?: string[];
  opening_hours?: BusinessHours;
  price_range?: any;
  estimated_delivery_time?: number | string;
  trending?: boolean;
  restaurant_id?: string;
  user_id?: string;
  created_at?: string;
}

export interface BusinessHours {
  monday: BusinessDay;
  tuesday: BusinessDay;
  wednesday: BusinessDay;
  thursday: BusinessDay;
  friday: BusinessDay;
  saturday: BusinessDay;
  sunday: BusinessDay;
  regular?: {
    monday: { open: string; close: string; is_closed: boolean };
    tuesday: { open: string; close: string; is_closed: boolean };
    wednesday: { open: string; close: string; is_closed: boolean };
    thursday: { open: string; close: string; is_closed: boolean };
    friday: { open: string; close: string; is_closed: boolean };
    saturday: { open: string; close: string; is_closed: boolean };
    sunday: { open: string; close: string; is_closed: boolean };
  };
}

export interface BusinessDay {
  open: string;
  close: string;
  is_closed: boolean;
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
}

export interface MenuCustomizationOption {
  name: string;
  required?: boolean;
  multiple?: boolean;
  values: {
    name: string;
    price?: number;
    default?: boolean;
  }[];
}

export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  menu_item_id: string;
  is_on_promotion: boolean;
  discount_type: string;
  discount_value: number;
  start_date?: string;
  end_date?: string;
  title?: string;
  description?: string;
  conditions?: string[];
}

export interface MenuStatistics {
  totalItems?: number;
  categoryCounts?: Record<string, number>;
  popularityDistribution?: Record<string, number>;
  priceDistribution?: {
    min: number;
    max: number;
    avg: number;
    median: number;
  };
  dietaryOptions?: Record<string, number>;
  topSellingItems?: string[];
}

export interface MenuRecommendation {
  item_id: string;
  reason: string;
  confidence: number;
  type?: string;
}

export interface MenuAnalysisResult {
  statistics: MenuStatistics;
  recommendations: MenuRecommendation[];
  popularity: {
    [itemId: string]: number;
  };
  mostPopularCategory?: string;
}

export interface RestaurantDetails extends Restaurant {
  menu_categories: { id: string; name: string }[];
  popular_items: MenuItem[];
  reviews: any[];
  special_offers: any[];
  min_order: number;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  status: string;
  location?: string;
  is_available?: boolean;
  is_accessible?: boolean;
  minimum_guests?: number;
  maximum_guests?: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  table_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: number;
  reservation_date: string;
  status: string;
  notes?: string;
}

export interface RestaurantFilters {
  search?: string;
  cuisine_type?: string | string[];
  price_range?: any;
  min_rating?: number;
  sort_by?: string;
  open_now?: boolean;
  delivery_time?: number;
  distance?: number;
  featured?: boolean;
  has_promotions?: boolean;
  dietary_options?: string[];
  sort?: string;
}

export interface RestaurantPromotion {
  id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  discount_type: string;
  discount_value: number;
  min_order_amount?: number;
  start_date?: string;
  end_date?: string;
  active: boolean;
  conditions?: string[];
}

export type PriceRange = {
  min: number;
  max: number;
  currency?: string;
};

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  route: string;
}
