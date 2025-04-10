
import { Restaurant } from "./restaurant";

export interface MenuStatistics {
  popularItems: MenuItem[];
  categoryBreakdown: {
    category: string;
    count: number;
    percentage: number;
  }[];
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface MenuRecommendation {
  itemId: string;
  itemName: string;
  recommendedPrice: number;
  currentPrice: number;
  potentialRevenueIncrease: number;
  reason: string;
}

export interface MenuEngagement {
  viewCount: number;
  orderCount: number;
  conversionRate: number;
  mostViewedItems: {
    itemId: string;
    itemName: string;
    viewCount: number;
  }[];
  leastOrderedItems: {
    itemId: string;
    itemName: string;
    orderCount: number;
  }[];
}

export interface MenuAnalysisResult {
  popularity: {
    mostPopular: MenuItem[];
    leastPopular: MenuItem[];
  };
  profitability: {
    mostProfitable: MenuItem[];
    leastProfitable: MenuItem[];
  };
  pricingAnalysis: {
    underpriced: MenuItem[];
    overpriced: MenuItem[];
  };
  categoryAnalysis: {
    [category: string]: {
      itemCount: number;
      averagePopularity: number;
      averageProfit: number;
    };
  };
  recommendations: {
    pricing: {
      itemId: string;
      currentPrice: number;
      recommendedPrice: number;
      potentialRevenue: number;
    }[];
    promotion: MenuItem[];
    removal: MenuItem[];
    addition: string[];
  };
  mostPopularCategory: string;
}

export interface MenuPromotionAnalysis {
  activePromotions: number;
  totalRevenueFromPromotions: number;
  bestPerformingPromotion: {
    id: string;
    name: string;
    revenue: number;
    orderCount: number;
  };
  worstPerformingPromotion: {
    id: string;
    name: string;
    revenue: number;
    orderCount: number;
  };
  promotionConversionRate: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  restaurant_id: string;
  image_url?: string;
  category?: string;
  available: boolean;
  created_at: string;
  dietary_preferences?: string[];
  cuisine_type?: string;
  
  // Propriétés étendues
  popularity_score?: number;
  preparation_time?: number;
  ingredients?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  profit_margin?: number;
  nutritional_info?: {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
    sodium: number;
    fiber: number;
  };
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: string;
    discount_value: number;
    start_date?: string;
    end_date?: string;
  };
  customization_options?: MenuCustomizationOption[];
  nutritional_score?: number;
  average_rating?: number;
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  min_selections?: number;
  max_selections?: number;
  values: {
    id: string;
    name: string;
    price: number;
    default?: boolean;
  }[];
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  image_url?: string;
  position: number;
  created_at: string;
  item_count?: number;
}

export interface MenuItemWithRestaurant extends MenuItem {
  restaurant: Restaurant;
}
