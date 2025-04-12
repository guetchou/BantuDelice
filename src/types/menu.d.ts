
import { MenuItem, MenuCustomizationOption, MenuPromotion, MenuStatistics, MenuRecommendation, MenuAnalysisResult } from './restaurant';

export { MenuItem, MenuCustomizationOption, MenuPromotion, MenuStatistics, MenuRecommendation, MenuAnalysisResult };

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  restaurant_id: string;
  display_order?: number;
  active?: boolean;
}
