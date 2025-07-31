
import { MenuItem } from '@/types/menu';

export interface MenuAnalysisOptions {
  includeUnavailable?: boolean;
  detailedAnalysis?: boolean;
}

export interface PriceStats {
  min: number;
  max: number;
  average: number;
  median: number;
}

export interface DietaryStats {
  vegetarianCount: number;
  vegetarianPercentage: number;
  veganCount: number;
  veganPercentage: number;
  glutenFreeCount: number;
  glutenFreePercentage: number;
}

export interface PopularityStats {
  mostPopular: MenuItem[];
  leastPopular: MenuItem[];
  averagePopularity: number;
}

export interface AvailabilityStats {
  availableCount: number;
  availablePercentage: number;
}

export interface MenuSuggestion {
  type: 'price' | 'availability' | 'balance' | 'performance';
  priority: 'low' | 'medium' | 'high';
  message: string;
  affectedItems: string[];
}

export interface MenuAnalysisResult {
  totalItems: number;
  categoriesCount: number;
  categories: string[];
  priceStats: PriceStats;
  dietaryOptions: DietaryStats;
  popularityStats: PopularityStats;
  availability: AvailabilityStats;
  menuSuggestions: MenuSuggestion[];
}
