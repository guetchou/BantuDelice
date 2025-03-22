
/**
 * Core menu analysis functionality
 */

import { MenuItem } from '@/types/menu';
import { MenuAnalysisResult } from './types';
import { getMedian, createEmptyAnalysis } from './utils';
import { generateSuggestions } from './suggestions';

/**
 * Analyse un menu et génère des statistiques et des suggestions
 * @param items Éléments du menu à analyser
 * @returns Résultat de l'analyse avec statistiques et suggestions
 */
export const analyzeMenu = (items: MenuItem[]): MenuAnalysisResult => {
  if (!items || items.length === 0) {
    return createEmptyAnalysis();
  }

  // Données de base
  const totalItems = items.length;
  const categories = Array.from(new Set(items.map(item => item.category)));
  const categoriesCount = categories.length;

  // Statistiques de prix
  const prices = items.map(item => item.price).filter(price => price > 0);
  const priceStats = {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    median: getMedian(prices)
  };

  // Options diététiques
  const vegetarianItems = items.filter(item => item.is_vegetarian);
  const veganItems = items.filter(item => item.is_vegan);
  const glutenFreeItems = items.filter(item => item.is_gluten_free);

  const dietaryOptions = {
    vegetarianCount: vegetarianItems.length,
    vegetarianPercentage: (vegetarianItems.length / totalItems) * 100,
    veganCount: veganItems.length,
    veganPercentage: (veganItems.length / totalItems) * 100,
    glutenFreeCount: glutenFreeItems.length,
    glutenFreePercentage: (glutenFreeItems.length / totalItems) * 100
  };

  // Statistiques de popularité
  const itemsWithPopularity = items.filter(item => item.popularity_score !== undefined);
  const sortedByPopularity = [...itemsWithPopularity].sort((a, b) => 
    (b.popularity_score || 0) - (a.popularity_score || 0)
  );

  const popularityStats = {
    mostPopular: sortedByPopularity.slice(0, 5),
    leastPopular: sortedByPopularity.slice(-5).reverse(),
    averagePopularity: itemsWithPopularity.reduce((sum, item) => sum + (item.popularity_score || 0), 0) / 
      (itemsWithPopularity.length || 1)
  };

  // Disponibilité
  const availableItems = items.filter(item => item.available);
  const availability = {
    availableCount: availableItems.length,
    availablePercentage: (availableItems.length / totalItems) * 100
  };

  // Générer des suggestions
  const menuSuggestions = generateSuggestions(items, {
    priceStats,
    categories,
    popularityStats,
    dietaryOptions
  });

  return {
    totalItems,
    categoriesCount,
    categories,
    priceStats,
    dietaryOptions,
    popularityStats,
    availability,
    menuSuggestions
  };
};

export default {
  analyzeMenu
};
