
/**
 * Menu suggestion generation
 */

import { MenuItem } from '@/types/menu';

// Générer des suggestions d'optimisation du menu
export const generateSuggestions = (
  items: MenuItem[], 
  stats: any
): { id: string; type: 'add' | 'modify' | 'remove' | 'price' | 'availability'; message: string; importance: 'high' | 'medium' | 'low'; itemId?: string }[] => {
  const suggestions = [];
  
  // Vérifier l'équilibre des catégories
  const categoryDistribution = new Map<string, number>();
  items.forEach(item => {
    categoryDistribution.set(
      item.category,
      (categoryDistribution.get(item.category) || 0) + 1
    );
  });
  
  // Trouver des catégories surreprésentées ou sous-représentées
  const avgItemsPerCategory = items.length / stats.categories.length;
  categoryDistribution.forEach((count, category) => {
    if (count > avgItemsPerCategory * 2) {
      suggestions.push({
        id: `category-overrepresented-${category}`,
        type: 'modify' as const,
        message: `La catégorie "${category}" contient beaucoup d'items (${count}). Envisagez de la subdiviser en sous-catégories.`,
        importance: 'medium' as const
      });
    } else if (count <= 2 && items.length > 10) {
      suggestions.push({
        id: `category-underrepresented-${category}`,
        type: 'add' as const,
        message: `La catégorie "${category}" ne contient que ${count} item(s). Envisagez d'ajouter plus d'options ou de fusionner avec une autre catégorie.`,
        importance: 'low' as const
      });
    }
  });
  
  // Vérifier les options végétariennes/véganes
  if (stats.dietaryOptions.vegetarianPercentage < 20 && items.length >= 10) {
    suggestions.push({
      id: 'add-vegetarian-options',
      type: 'add' as const,
      message: `Seulement ${stats.dietaryOptions.vegetarianPercentage.toFixed(0)}% des plats sont végétariens. Ajoutez plus d'options pour cette clientèle.`,
      importance: 'high' as const
    });
  }
  
  // Analyser les prix
  items.forEach(item => {
    if (item.price > stats.priceStats.average * 2) {
      suggestions.push({
        id: `high-price-${item.id}`,
        type: 'price' as const,
        message: `"${item.name}" est considérablement plus cher que la moyenne. Assurez-vous que la qualité justifie ce prix.`,
        importance: 'medium' as const,
        itemId: item.id
      });
    }
  });
  
  // Vérifier les items peu populaires avec prix élevés
  stats.popularityStats.leastPopular.forEach(item => {
    if (item.price > stats.priceStats.average) {
      suggestions.push({
        id: `unpopular-expensive-${item.id}`,
        type: 'modify' as const,
        message: `"${item.name}" est peu populaire mais coûteux. Envisagez de réviser son prix ou sa recette.`,
        importance: 'high' as const,
        itemId: item.id
      });
    }
  });
  
  return suggestions;
};

export default {
  generateSuggestions
};
