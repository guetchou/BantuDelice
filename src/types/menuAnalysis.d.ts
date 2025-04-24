
// Types pour l'analyse des menus et des restaurants
export interface MenuPromotion {
  id: string;
  title: string;
  description: string;
  discount_type?: string;
  discount_value?: number;
  start_date?: string;
  end_date?: string;
  conditions?: string[];
}

export interface MenuStatistics {
  popularItems: MenuItem[];
  profitMargins: {itemId: string; margin?: number}[];
  salesTrends: any[];
  categoryPerformance: any[];
  timeBasedAnalysis: any[];
}

export interface MenuRecommendation {
  id: string;
  recommendationType: string;
  strength: string;
  details?: any;
}

export interface ExtendedMenuAnalysisResult extends MenuAnalysisResult {
  lowProfitItems?: MenuItem[];
  highProfitItems?: MenuItem[];
  slowMovers?: MenuItem[];
  fastMovers?: MenuItem[];
  priceChangeRecommendations?: { itemId: string; suggestedPrice: number }[];
  bundleOpportunities?: MenuItem[];
  seasonalRecommendations?: any[];
  mostPopularCategory?: string;
}
