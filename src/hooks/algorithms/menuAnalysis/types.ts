
/**
 * Types for menu analysis
 */

import { MenuItem } from '@/types/menu';

export interface MenuAnalysisResult {
  totalItems: number;
  categoriesCount: number;
  categories: string[];
  priceStats: {
    min: number;
    max: number;
    average: number;
    median: number;
  };
  dietaryOptions: {
    vegetarianCount: number;
    vegetarianPercentage: number;
    veganCount: number;
    veganPercentage: number;
    glutenFreeCount: number;
    glutenFreePercentage: number;
  };
  popularityStats: {
    mostPopular: MenuItem[];
    leastPopular: MenuItem[];
    averagePopularity: number;
  };
  availability: {
    availableCount: number;
    availablePercentage: number;
  };
  menuSuggestions: {
    id: string;
    type: 'add' | 'modify' | 'remove' | 'price' | 'availability';
    message: string;
    importance: 'high' | 'medium' | 'low';
    itemId?: string;
  }[];
}

export interface MenuAnalysisOptions {
  includeUnavailable?: boolean;
  detailedAnalysis?: boolean;
}
