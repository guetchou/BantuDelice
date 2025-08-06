
/**
 * Personalized recommendations based on user history and preferences
 */

import { MenuItem } from '@/types/menu';

/**
 * Generates personalized menu item recommendations based on user history
 * @param items All available menu items
 * @param orderHistory User's order history
 * @param count Number of recommendations to return
 * @returns Array of recommended menu items
 */
export const generatePersonalizedRecommendations = (
  items: MenuItem[],
  orderHistory: unknown[] = [],
  count: number = 4
): MenuItem[] => {
  if (!items || items.length === 0) {
    return [];
  }

  // Si pas d'historique, retourner les items les plus populaires
  if (!orderHistory || orderHistory.length === 0) {
    return items
      .filter(item => item.available)
      .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
      .slice(0, count);
  }

  // Calculer les préférences de l'utilisateur
  const userPreferences = {
    categories: new Map<string, number>(),
    priceRange: {
      min: Infinity,
      max: 0,
      avg: 0
    },
    dietary: {
      vegetarian: 0,
      vegan: 0,
      glutenFree: 0
    }
  };

  // Analyser l'historique pour déterminer les préférences
  let totalItems = 0;

  orderHistory.forEach(order => {
    if (order.items) {
      order.items.forEach((orderedItem: unknown) => {
        const menuItem = items.find(item => item.id === orderedItem.menuItemId);
        if (menuItem) {
          // Comptabiliser la catégorie
          userPreferences.categories.set(
            menuItem.category,
            (userPreferences.categories.get(menuItem.category) || 0) + 1
          );

          // Suivre la gamme de prix
          userPreferences.priceRange.min = Math.min(userPreferences.priceRange.min, menuItem.price);
          userPreferences.priceRange.max = Math.max(userPreferences.priceRange.max, menuItem.price);
          userPreferences.priceRange.avg += menuItem.price;

          // Comptabiliser les préférences diététiques
          if (menuItem.is_vegetarian) userPreferences.dietary.vegetarian++;
          if (menuItem.is_vegan) userPreferences.dietary.vegan++;
          if (menuItem.is_gluten_free) userPreferences.dietary.glutenFree++;

          totalItems++;
        }
      });
    }
  });

  // Calculer la moyenne des prix
  if (totalItems > 0) {
    userPreferences.priceRange.avg /= totalItems;
  }

  // Attribuer des scores aux items basés sur les préférences de l'utilisateur
  const scoredItems = items
    .filter(item => item.available)
    .map(item => {
      let score = 0;

      // Score basé sur la catégorie préférée
      const categoryPreference = userPreferences.categories.get(item.category) || 0;
      score += 0.4 * (categoryPreference / (totalItems || 1));

      // Score basé sur la gamme de prix
      const pricePreference = 1 - Math.abs(item.price - userPreferences.priceRange.avg) / 
        (userPreferences.priceRange.avg || 1);
      score += 0.2 * Math.max(0, pricePreference);

      // Score basé sur les préférences diététiques
      if (item.is_vegetarian && userPreferences.dietary.vegetarian > 0) {
        score += 0.1 * (userPreferences.dietary.vegetarian / (totalItems || 1));
      }
      if (item.is_vegan && userPreferences.dietary.vegan > 0) {
        score += 0.15 * (userPreferences.dietary.vegan / (totalItems || 1));
      }
      if (item.is_gluten_free && userPreferences.dietary.glutenFree > 0) {
        score += 0.1 * (userPreferences.dietary.glutenFree / (totalItems || 1));
      }

      // Bonus pour les items populaires
      score += 0.1 * (item.popularity_score || 0);

      return { item, score };
    });

  // Trier par score et prendre les N meilleurs
  return scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(scoredItem => scoredItem.item);
};

export default {
  generatePersonalizedRecommendations
};
