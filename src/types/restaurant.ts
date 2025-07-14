
// Re-export from globalTypes to maintain compatibility
export type { 
  Restaurant, 
  MenuItem, 
  MenuPromotion, 
  MenuStatistics, 
  MenuRecommendation, 
  MenuAnalysisResult,
  ExtendedMenuAnalysisResult,
  ExtendedMenuItem
} from './globalTypes';

export interface MenuCustomizationOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface BusinessHours {
  monday: { open: string; close: string; is_closed: boolean };
  tuesday: { open: string; close: string; is_closed: boolean };
  wednesday: { open: string; close: string; is_closed: boolean };
  thursday: { open: string; close: string; is_closed: boolean };
  friday: { open: string; close: string; is_closed: boolean };
  saturday: { open: string; close: string; is_closed: boolean };
  sunday: { open: string; close: string; is_closed: boolean };
}
