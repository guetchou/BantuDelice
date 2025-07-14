
// Re-export from globalTypes to maintain compatibility
export type { 
  MenuItem, 
  MenuPromotion, 
  MenuStatistics, 
  MenuRecommendation, 
  MenuAnalysisResult,
  ExtendedMenuAnalysisResult
} from './globalTypes';

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  restaurant_id: string;
  display_order?: number;
  active?: boolean;
}
