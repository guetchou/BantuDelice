
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
  average_prep_time?: number;
  total_ratings?: number;
  payment_methods?: string[];
  minimum_order?: number;
}

export interface BusinessHours {
  monday?: {
    open: string;
    close: string;
  };
  tuesday?: {
    open: string;
    close: string;
  };
  wednesday?: {
    open: string;
    close: string;
  };
  thursday?: {
    open: string;
    close: string;
  };
  friday?: {
    open: string;
    close: string;
  };
  saturday?: {
    open: string;
    close: string;
  };
  sunday?: {
    open: string;
    close: string;
  };
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  required: boolean;
  multiple?: boolean;
  values: {
    value: string;
    price?: number;
    default?: boolean;
  }[];
}

export interface MenuPromotion {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_item';
  discount_value: number;
  valid_from: string;
  valid_to: string;
  promotion_hours?: {
    days: string[];
    start: string;
    end: string;
  };
  conditions?: string[];
  min_order_value?: number;
  restaurant_id: string;
}

export interface MenuStatistics {
  popularItems: any[];
  profitMargins: any[];
  salesTrends: any[];
  categoryPerformance: any[];
  timeBasedAnalysis: any[];
}

export interface MenuRecommendation {
  id: string;
  itemId: string;
  recommendedItemId: string;
  recommendationType: string;
  strength: number;
}

export interface MenuAnalysisResult {
  lowProfitItems: any[];
  highProfitItems: any[];
  slowMovers: any[];
  fastMovers: any[];
  priceChangeRecommendations: any[];
  bundleOpportunities: any[];
  seasonalRecommendations: any[];
  mostPopularCategory?: string;
}

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  status: string;
  location: string;
}
