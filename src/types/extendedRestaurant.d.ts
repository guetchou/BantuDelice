
import { Restaurant as BaseRestaurant, MenuItem, BusinessHours } from '@/types/restaurant';

// Extension du type Restaurant pour inclure les propriétés manquantes
export interface ExtendedRestaurant extends BaseRestaurant {
  trending?: boolean;
  price_range?: number;
  average_prep_time?: number;
  average_rating?: number;
  is_open?: boolean;
  featured?: boolean;
  total_ratings?: number;
  website?: string;
  special_features?: string[];
  payment_methods?: string[];
  estimated_delivery_time?: number;
  min_order?: number;
}

// Extension de l'interface UserProfile pour inclure les propriétés manquantes
export interface ExtendedUserProfile {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'user' | 'admin' | 'restaurant_owner' | 'driver';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  phone?: string;
  status?: "active" | "inactive" | "pending"; 
  last_login?: string;
}

// Extension de MenuItem pour inclure les propriétés profit_margin
export interface ExtendedMenuItem extends MenuItem {
  profit_margin?: number;
  average_rating?: number;
}

// Extension des heures d'ouverture
export interface ExtendedBusinessHours extends BusinessHours {
  regular: Record<string, ExtendedDayHours>;
  special?: Record<string, ExtendedDayHours>;
  holidays?: string[];
}

export interface ExtendedDayHours {
  open: string;
  close: string;
  is_closed?: boolean;
}

// Extension pour CartItem avec propriétés supplémentaires
export interface ExtendedCartItem {
  special_instructions?: string;
  fiber?: number;
}

// Types for menu analysis
export interface MenuStatistics {
  popularItems: MenuItem[];
  profitMargins: Array<{ itemId: string, margin?: number }>;
  salesTrends: any[];
  categoryPerformance: any[];
  timeBasedAnalysis: any[];
}

export interface MenuRecommendation {
  id?: string;
  recommendationType?: string;
  strength?: string;
}

export interface ExtendedMenuAnalysisResult {
  lowProfitItems?: ExtendedMenuItem[];
  highProfitItems?: ExtendedMenuItem[];
  slowMovers?: MenuItem[];
  fastMovers?: MenuItem[];
  priceChangeRecommendations?: Array<{ itemId: string, suggestedPrice: number }>;
  bundleOpportunities?: MenuItem[];
  seasonalRecommendations?: any[];
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
  insights: string[];
  menuSuggestions: {
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}
