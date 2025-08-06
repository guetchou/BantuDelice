
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: 'customer' | 'restaurant_owner' | 'driver' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  preferences?: {
    language?: string;
    notifications?: boolean;
    theme?: 'light' | 'dark';
  };
  address?: {
    street?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface ExtendedUserProfile extends UserProfile {
  loyalty_points?: number;
  total_orders?: number;
  favorite_restaurants?: string[];
  payment_methods?: PaymentMethod[];
  last_login?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

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
  is_open?: boolean;
  opening_hours?: unknown;
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
  menu_items?: MenuItem[];
  trending?: boolean;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  restaurant_id: string;
  special_instructions?: string;
  combo_item?: boolean;
  options: CartItemOption[];
  description?: string;
  image_url?: string;
  category?: string;
}

export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
  price_adjustment: number;
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
  nutrition_info?: unknown;
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  customization_options?: unknown[];
  stock_level?: number;
  stock?: number;
  popularity_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'mobile_money' | 'cash' | 'wallet';
  details: unknown;
  is_default?: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  items: CartItem[];
  delivery_address?: string;
  payment_method?: PaymentMethod;
  created_at: string;
  updated_at?: string;
}

export interface SpecialHour {
  id: string;
  restaurant_id: string;
  date: string;
  opening_time?: string;
  closing_time?: string;
  is_closed: boolean;
  reason?: string;
}

export interface BusinessRateEstimate {
  baseDiscount: number;
  volumeDiscount: number;
  totalDiscount: number;
  standardRate: number;
  businessRate: number;
  monthlySavings: number;
  annualSavings: number;
  formattedTotal?: string;
  perRideDiscount?: number;
  monthlyRides?: number;
  vehicleType?: string;
}

export interface BusinessRateFormData {
  companyName: string;
  contactEmail: string;
  monthlyRides: number;
  averageDistance: number;
  vehicleType: string;
  employeeCount?: number;
  estimatedMonthlyRides?: number;
  contactPerson?: string;
  contactPhone?: string;
}

export interface MenuPromotion {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  discount_amount?: number;
  discount_type?: string;
  discount_value?: number;
  start_date: string;
  end_date: string;
  valid_from?: string;
  valid_to?: string;
  active: boolean;
  restaurant_id: string;
  menu_item_ids?: string[];
  promotion_hours?: unknown;
  conditions?: unknown;
  min_order_value?: number;
}

export interface ExtendedMenuItem extends MenuItem {
  profit_margin?: number;
  popularity_score?: number;
  sales_volume?: number;
  last_ordered?: string;
}

export interface MenuAnalysisResult {
  totalItems: number;
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
  menuSuggestions: Array<{
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface ExtendedMenuAnalysisResult extends MenuAnalysisResult {
  lowProfitItems?: ExtendedMenuItem[];
  highProfitItems?: ExtendedMenuItem[];
  slowMovers?: ExtendedMenuItem[];
  fastMovers?: ExtendedMenuItem[];
  priceChangeRecommendations?: Array<{
    itemId: string;
    suggestedPrice: number;
  }>;
  bundleOpportunities?: ExtendedMenuItem[];
  seasonalRecommendations?: unknown[];
  mostPopularCategory?: string;
}

export interface MenuStatistics {
  popularItems: MenuItem[];
  profitMargins: Array<{
    itemId: string;
    margin?: number;
  }>;
  salesTrends: unknown[];
  categoryPerformance: unknown[];
  timeBasedAnalysis: unknown[];
}

export interface MenuRecommendation {
  id?: string;
  recommendationType: string;
  strength: string;
}
