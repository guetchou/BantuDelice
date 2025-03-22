
import { MenuItem } from '@/types/menu';

interface MenuAnalysisResult {
  totalItems: number;
  priceStats: {
    min: number;
    max: number;
    average: number;
    median: number;
  };
  categoryBreakdown: Record<string, number>;
  mostPopularCategory: string;
  dietaryOptions: {
    vegetarianCount: number;
    vegetarianPercentage: number;
    veganCount: number;
    veganPercentage: number;
    glutenFreeCount: number;
    glutenFreePercentage: number;
  };
}

/**
 * Analyzes a restaurant menu and provides insights
 * @param items Menu items to analyze
 * @returns Analysis results
 */
export const analyzeMenu = (items: MenuItem[]): MenuAnalysisResult => {
  if (!items || items.length === 0) {
    return {
      totalItems: 0,
      priceStats: { min: 0, max: 0, average: 0, median: 0 },
      categoryBreakdown: {},
      mostPopularCategory: '',
      dietaryOptions: {
        vegetarianCount: 0, vegetarianPercentage: 0,
        veganCount: 0, veganPercentage: 0,
        glutenFreeCount: 0, glutenFreePercentage: 0
      }
    };
  }

  // Calculate total items
  const totalItems = items.length;

  // Calculate price statistics
  const prices = items.map(item => item.price).sort((a, b) => a - b);
  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / totalItems;
  const medianPrice = prices[Math.floor(prices.length / 2)];

  // Calculate category breakdown
  const categoryBreakdown: Record<string, number> = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find most popular category
  const mostPopularCategory = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])[0][0];

  // Calculate dietary options
  const vegetarianCount = items.filter(item => item.is_vegetarian).length;
  const veganCount = items.filter(item => item.is_vegan).length;
  const glutenFreeCount = items.filter(item => item.is_gluten_free).length;

  return {
    totalItems,
    priceStats: {
      min: minPrice,
      max: maxPrice,
      average: avgPrice,
      median: medianPrice
    },
    categoryBreakdown,
    mostPopularCategory,
    dietaryOptions: {
      vegetarianCount,
      vegetarianPercentage: (vegetarianCount / totalItems) * 100,
      veganCount,
      veganPercentage: (veganCount / totalItems) * 100,
      glutenFreeCount,
      glutenFreePercentage: (glutenFreeCount / totalItems) * 100
    }
  };
};
