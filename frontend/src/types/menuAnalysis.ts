
import { MenuItem } from '@/types/globalTypes';

export interface MenuPromotion {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  discount_amount?: number;
  start_date: string;
  end_date: string;
  active: boolean;
  restaurant_id: string;
  menu_item_ids?: string[];
  discount_type?: string;
  discount_value?: number;
  valid_from?: string;
  valid_to?: string;
  promotion_hours?: unknown;
  conditions?: unknown;
  min_order_value?: number;
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

export interface ExtendedMenuAnalysisResult {
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
  lowProfitItems?: MenuItem[];
  highProfitItems?: MenuItem[];
  slowMovers?: MenuItem[];
  fastMovers?: MenuItem[];
  priceChangeRecommendations?: Array<{
    itemId: string;
    suggestedPrice: number;
  }>;
  bundleOpportunities?: MenuItem[];
  seasonalRecommendations?: unknown[];
  mostPopularCategory?: string;
}
