
/**
 * Algorithme principal d'analyse de menu
 */

import { MenuItem } from '@/types/menu';
import { MenuAnalysisResult, MenuAnalysisOptions } from './types';
import { calculatePriceStats, calculateDietaryStats, calculatePopularityStats, calculateAvailabilityStats } from './stats';
import { generatePriceSuggestions, generateAvailabilitySuggestions, generateBalanceSuggestions, generatePerformanceSuggestions } from './suggestions';

/**
 * Analyse un menu et génère des statistiques et des suggestions
 * @param items Éléments du menu à analyser
 * @param options Options d'analyse
 * @returns Résultat de l'analyse avec statistiques et suggestions
 */
const analyzeMenu = (
  items: MenuItem[],
  options: MenuAnalysisOptions = {}
): MenuAnalysisResult => {
  // Filtre les articles selon les options
  const itemsToAnalyze = options.includeUnavailable 
    ? items
    : items.filter(item => item.available);

  if (!itemsToAnalyze.length) {
    return {
      totalItems: 0,
      categoriesCount: 0,
      categories: [],
      priceStats: { min: 0, max: 0, average: 0, median: 0 },
      dietaryOptions: {
        vegetarianCount: 0,
        vegetarianPercentage: 0,
        veganCount: 0,
        veganPercentage: 0,
        glutenFreeCount: 0,
        glutenFreePercentage: 0,
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
  }

  // Calcul des statistiques de base
  const categories = [...new Set(itemsToAnalyze.map(item => item.category))];
  const priceStats = calculatePriceStats(itemsToAnalyze);
  const dietaryOptions = calculateDietaryStats(itemsToAnalyze);
  const popularityStats = calculatePopularityStats(itemsToAnalyze);
  const availability = calculateAvailabilityStats(items); // Toujours sur tous les items

  // Génération des suggestions
  let menuSuggestions = [];
  if (options.detailedAnalysis) {
    menuSuggestions = [
      ...generatePriceSuggestions(itemsToAnalyze),
      ...generateAvailabilitySuggestions(items),
      ...generateBalanceSuggestions(itemsToAnalyze),
      ...generatePerformanceSuggestions(itemsToAnalyze)
    ];
  }

  return {
    totalItems: itemsToAnalyze.length,
    categoriesCount: categories.length,
    categories,
    priceStats,
    dietaryOptions,
    popularityStats,
    availability,
    menuSuggestions
  };
};

// Exporter l'analyseur comme objet pour faciliter les tests et les mock
const analyzer = {
  analyzeMenu
};

export default analyzer;
