
/**
 * Utility functions for menu analysis
 */

// Fonction pour obtenir la médiane d'un tableau de nombres
export const getMedian = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
};

// Créer une analyse vide pour les cas où il n'y a pas d'éléments
export const createEmptyAnalysis = () => {
  return {
    totalItems: 0,
    categoriesCount: 0,
    categories: [],
    priceStats: {
      min: 0,
      max: 0,
      average: 0,
      median: 0
    },
    dietaryOptions: {
      vegetarianCount: 0,
      vegetarianPercentage: 0,
      veganCount: 0,
      veganPercentage: 0,
      glutenFreeCount: 0,
      glutenFreePercentage: 0
    },
    popularityStats: {
      mostPopular: [],
      leastPopular: [],
      averagePopularity: 0
    },
    availability: {
      availableCount: 0,
      availablePercentage: 0
    },
    menuSuggestions: []
  };
};
