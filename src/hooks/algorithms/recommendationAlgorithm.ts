
import { MenuItem } from '@/types/menu';

interface SimilarityScore {
  item: MenuItem;
  score: number;
}

/**
 * Recommande des plats similaires à un plat sélectionné
 * @param items Tous les éléments du menu disponibles
 * @param selectedItem L'élément sélectionné pour lequel chercher des similaires
 * @param count Nombre de recommandations à retourner
 * @returns Liste d'éléments de menu recommandés
 */
export const recommendRelatedItems = (
  items: MenuItem[],
  selectedItem: MenuItem | null,
  count: number = 3
): MenuItem[] => {
  if (!selectedItem || !items || items.length === 0) {
    return [];
  }

  // Exclure l'item sélectionné des recommandations
  const otherItems = items.filter(item => item.id !== selectedItem.id && item.available);
  
  if (otherItems.length === 0) {
    return [];
  }

  // Calculer les scores de similarité pour chaque item
  const similarityScores: SimilarityScore[] = otherItems.map(item => ({
    item,
    score: calculateSimilarityScore(selectedItem, item)
  }));

  // Trier par score de similarité et prendre les N plus similaires
  return similarityScores
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(scoredItem => scoredItem.item);
};

/**
 * Calcule un score de similarité entre deux items du menu
 * Plus le score est élevé, plus les items sont similaires
 */
const calculateSimilarityScore = (item1: MenuItem, item2: MenuItem): number => {
  let score = 0;

  // Même catégorie = forte similarité
  if (item1.category === item2.category) {
    score += 0.4;
  }

  // Gamme de prix similaire
  const priceDifference = Math.abs(item1.price - item2.price);
  const priceRange = Math.max(item1.price, item2.price) * 0.3; // 30% du prix le plus élevé
  if (priceDifference <= priceRange) {
    score += 0.2 * (1 - priceDifference / (priceRange || 1));
  }

  // Similarité des préférences diététiques
  if (item1.is_vegetarian === item2.is_vegetarian) score += 0.1;
  if (item1.is_vegan === item2.is_vegan) score += 0.1;
  if (item1.is_gluten_free === item2.is_gluten_free) score += 0.1;

  // Similarité dans les ingrédients (si disponibles)
  if (item1.ingredients && item2.ingredients) {
    const commonIngredients = item1.ingredients.filter(ingredient => 
      item2.ingredients?.includes(ingredient)
    );
    
    const ingredientSimilarity = commonIngredients.length / 
      Math.max(item1.ingredients.length, item2.ingredients.length || 1);
    
    score += 0.2 * ingredientSimilarity;
  }

  // Popularité similaire (si disponible)
  if (item1.popularity_score !== undefined && item2.popularity_score !== undefined) {
    const popularityDifference = Math.abs(item1.popularity_score - item2.popularity_score);
    score += 0.1 * (1 - popularityDifference);
  }

  // Temps de préparation similaire (si disponible)
  if (item1.preparation_time && item2.preparation_time) {
    const prepTimeDifference = Math.abs(item1.preparation_time - item2.preparation_time);
    const maxPrepTime = Math.max(item1.preparation_time, item2.preparation_time);
    
    score += 0.05 * (1 - prepTimeDifference / maxPrepTime);
  }

  return Math.min(score, 1); // Plafonner le score à 1
};

/**
 * Génère des recommandations personnalisées basées sur l'historique d'un utilisateur
 * @param items Tous les éléments du menu disponibles
 * @param orderHistory Historique des commandes de l'utilisateur
 * @param count Nombre de recommandations à retourner
 */
export const generatePersonalizedRecommendations = (
  items: MenuItem[],
  orderHistory: any[] = [],
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
      order.items.forEach((orderedItem: any) => {
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
