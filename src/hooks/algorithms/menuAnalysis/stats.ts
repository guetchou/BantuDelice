
import { MenuItem } from '@/types/menu';

/**
 * Calculate price statistics for a set of menu items
 */
export const calculatePriceStats = (items: MenuItem[]) => {
  if (!items.length) {
    return { min: 0, max: 0, average: 0, median: 0 };
  }

  const prices = items.map(item => item.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  // Calculate median
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const middle = Math.floor(sortedPrices.length / 2);
  const median = sortedPrices.length % 2 === 0
    ? (sortedPrices[middle - 1] + sortedPrices[middle]) / 2
    : sortedPrices[middle];

  return { min, max, average, median };
};

/**
 * Calculate dietary statistics for a set of menu items
 */
export const calculateDietaryStats = (items: MenuItem[]) => {
  if (!items.length) {
    return {
      vegetarianCount: 0,
      vegetarianPercentage: 0,
      veganCount: 0,
      veganPercentage: 0,
      glutenFreeCount: 0,
      glutenFreePercentage: 0
    };
  }

  // This implementation assumes the items have dietary properties
  // If not, we need to add them to the MenuItem type
  const vegetarianCount = items.filter(item => item.is_vegetarian).length;
  const veganCount = items.filter(item => item.is_vegan).length;
  const glutenFreeCount = items.filter(item => item.is_gluten_free).length;

  return {
    vegetarianCount,
    vegetarianPercentage: (vegetarianCount / items.length) * 100,
    veganCount,
    veganPercentage: (veganCount / items.length) * 100,
    glutenFreeCount,
    glutenFreePercentage: (glutenFreeCount / items.length) * 100
  };
};

/**
 * Calculate popularity statistics for a set of menu items
 */
export const calculatePopularityStats = (items: MenuItem[]) => {
  if (!items.length) {
    return {
      mostPopular: [],
      leastPopular: [],
      averagePopularity: 0
    };
  }

  // Sort by popularity (we assume there's a popularity score on the items)
  const sortedByPopularity = [...items].sort((a, b) => 
    (b.popularity_score || 0) - (a.popularity_score || 0)
  );

  const topItems = sortedByPopularity.slice(0, 3);
  const bottomItems = sortedByPopularity.slice(-3).reverse();
  const averagePopularity = items.reduce((sum, item) => sum + (item.popularity_score || 0), 0) / items.length;

  return {
    mostPopular: topItems,
    leastPopular: bottomItems,
    averagePopularity
  };
};

/**
 * Calculate availability statistics for a set of menu items
 */
export const calculateAvailabilityStats = (items: MenuItem[]) => {
  if (!items.length) {
    return {
      availableCount: 0,
      availablePercentage: 0
    };
  }

  const availableCount = items.filter(item => item.available).length;
  
  return {
    availableCount,
    availablePercentage: (availableCount / items.length) * 100
  };
};
