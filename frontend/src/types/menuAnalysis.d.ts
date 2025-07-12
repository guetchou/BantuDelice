
import { MenuItem } from './restaurant';

export interface MenuPromotion {
  id?: string;
  title: string;
  description?: string;
  active?: boolean;
}

export interface MenuStatistics {
  popularItems: MenuItem[];
  profitMargins: Array<{ itemId: string; margin?: number }>;
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
  menuSuggestions: {
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  lowProfitItems?: any[];
  highProfitItems?: any[];
  slowMovers?: any[];
  fastMovers?: any[];
  priceChangeRecommendations?: Array<{ itemId: string; suggestedPrice: number }>;
  bundleOpportunities?: any[];
  seasonalRecommendations?: any[];
  mostPopularCategory?: string;
}
