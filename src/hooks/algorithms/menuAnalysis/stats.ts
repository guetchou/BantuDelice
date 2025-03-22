
/**
 * Module pour les statistiques de menu
 */

import { MenuItem } from '@/types/menu';

/**
 * Calcule les statistiques de prix pour un ensemble d'articles de menu
 */
export const calculatePriceStats = (items: MenuItem[]) => {
  if (!items.length) {
    return { min: 0, max: 0, average: 0, median: 0 };
  }

  const prices = items.map(item => item.price).sort((a, b) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const sum = prices.reduce((acc, price) => acc + price, 0);
  const average = sum / prices.length;
  
  // Calcul de la médiane
  const middle = Math.floor(prices.length / 2);
  const median = prices.length % 2 === 0
    ? (prices[middle - 1] + prices[middle]) / 2
    : prices[middle];

  return { min, max, average, median };
};

/**
 * Calcule les statistiques diététiques pour un ensemble d'articles de menu
 */
export const calculateDietaryStats = (items: MenuItem[]) => {
  const totalItems = items.length;
  if (!totalItems) {
    return {
      vegetarianCount: 0,
      vegetarianPercentage: 0,
      veganCount: 0,
      veganPercentage: 0,
      glutenFreeCount: 0,
      glutenFreePercentage: 0
    };
  }

  const vegetarianCount = items.filter(item => item.is_vegetarian).length;
  const veganCount = items.filter(item => item.is_vegan).length;
  const glutenFreeCount = items.filter(item => item.is_gluten_free).length;

  return {
    vegetarianCount,
    vegetarianPercentage: (vegetarianCount / totalItems) * 100,
    veganCount,
    veganPercentage: (veganCount / totalItems) * 100,
    glutenFreeCount,
    glutenFreePercentage: (glutenFreeCount / totalItems) * 100
  };
};

/**
 * Calcule les statistiques de popularité pour un ensemble d'articles de menu
 */
export const calculatePopularityStats = (items: MenuItem[]) => {
  if (!items.length) {
    return {
      mostPopular: [],
      leastPopular: [],
      averagePopularity: 0
    };
  }

  // Trier par popularité (la plus élevée en premier)
  const sortedByPopularity = [...items].sort((a, b) => 
    (b.popularity_score || 0) - (a.popularity_score || 0)
  );

  const mostPopular = sortedByPopularity.slice(0, 3);
  const leastPopular = [...sortedByPopularity].reverse().slice(0, 3);
  
  const totalPopularity = items.reduce((sum, item) => sum + (item.popularity_score || 0), 0);
  const averagePopularity = totalPopularity / items.length;

  return {
    mostPopular,
    leastPopular,
    averagePopularity
  };
};

/**
 * Calcule les statistiques de disponibilité pour un ensemble d'articles de menu
 */
export const calculateAvailabilityStats = (items: MenuItem[]) => {
  const totalItems = items.length;
  if (!totalItems) {
    return {
      availableCount: 0,
      availablePercentage: 0
    };
  }

  const availableCount = items.filter(item => item.available).length;
  const availablePercentage = (availableCount / totalItems) * 100;

  return {
    availableCount,
    availablePercentage
  };
};
