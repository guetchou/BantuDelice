
import { MenuItem } from '@/types/menu';
import { analyzeMenu } from './menuAnalysisAlgorithm';

interface MenuSuggestion {
  message: string;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Generates menu improvement suggestions based on menu analysis
 * @param items Menu items to analyze
 * @returns Array of suggestions
 */
export const generateMenuSuggestions = (
  items: MenuItem[]
): MenuSuggestion[] => {
  if (!items || items.length === 0) {
    return [];
  }

  const analysis = analyzeMenu(items);
  const suggestions: MenuSuggestion[] = [];

  // Check for price range balance
  const { min, max, average } = analysis.priceStats;
  const priceRange = max - min;
  
  if (priceRange > average * 5) {
    suggestions.push({
      message: "Grand écart de prix dans le menu. Envisagez d'ajouter des options de prix moyens.",
      priority: 'medium'
    });
  }

  // Check for vegetarian options
  if (analysis.dietaryOptions.vegetarianPercentage < 15) {
    suggestions.push({
      message: "Peu d'options végétariennes. Envisagez d'ajouter plus de plats végétariens.",
      priority: 'high'
    });
  }

  // Check for vegan options
  if (analysis.dietaryOptions.veganPercentage < 10) {
    suggestions.push({
      message: "Peu d'options veganes. Envisagez d'étoffer cette catégorie pour attirer une clientèle plus diverse.",
      priority: 'medium'
    });
  }

  // Check for gluten-free options
  if (analysis.dietaryOptions.glutenFreePercentage < 10) {
    suggestions.push({
      message: "Peu d'options sans gluten. Ajoutez plus d'options pour répondre aux besoins alimentaires spécifiques.",
      priority: 'medium'
    });
  }

  // Check for category balance
  const categoryCount = Object.keys(analysis.categoryBreakdown).length;
  const maxCategoryPercentage = Math.max(...Object.values(analysis.categoryBreakdown)) / analysis.totalItems * 100;
  
  if (categoryCount < 3) {
    suggestions.push({
      message: "Menu limité en catégories. Envisagez d'ajouter plus de variété (entrées, plats, desserts).",
      priority: 'high'
    });
  }
  
  if (maxCategoryPercentage > 60) {
    suggestions.push({
      message: `Menu déséquilibré: ${analysis.mostPopularCategory} représente ${maxCategoryPercentage.toFixed(0)}% des plats.`,
      priority: 'medium'
    });
  }

  return suggestions;
};
