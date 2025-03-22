
import { MenuItem, MenuAnalytics } from "@/types/menu";

/**
 * Generates actionable suggestions to improve menu based on analysis
 */
export const generateMenuSuggestions = (menuAnalysis: MenuAnalytics | null, allItems: MenuItem[] | undefined) => {
  if (!menuAnalysis || !allItems) return [];
  
  const suggestions = [];
  
  // Suggestion 1: Catégories déséquilibrées
  const categoryCounts = Object.entries(menuAnalysis.categories);
  if (categoryCounts.length > 0) {
    const avgItemsPerCategory = allItems.length / categoryCounts.length;
    const unbalancedCategories = categoryCounts
      .filter(([_, count]) => (count as number) < avgItemsPerCategory * 0.5)
      .map(([category]) => category);
    
    if (unbalancedCategories.length > 0) {
      suggestions.push({
        type: 'category_balance',
        message: `Pensez à ajouter plus d'options dans ces catégories: ${unbalancedCategories.join(', ')}`,
        importance: 'medium'
      });
    }
  }
  
  // Suggestion 2: Options diététiques
  if (menuAnalysis.dietaryOptions.vegetarianPercentage < 20) {
    suggestions.push({
      type: 'dietary_options',
      message: 'Augmentez le nombre de plats végétariens pour attirer plus de clients',
      importance: 'high'
    });
  }
  
  // Suggestion 3: Prix
  if (menuAnalysis.priceStats.range > menuAnalysis.priceStats.average * 3) {
    suggestions.push({
      type: 'price_range',
      message: 'Votre menu a une grande variation de prix. Envisagez d\'ajouter des options de prix moyen',
      importance: 'medium'
    });
  }
  
  return suggestions;
};
