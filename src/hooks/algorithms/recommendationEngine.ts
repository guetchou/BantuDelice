
/**
 * Recommendation engine for menu items
 * This file contains the core recommendation logic
 */

import { MenuItem } from '@/types/menu';

/**
 * Calculates similarity score between two menu items
 * @param item1 First menu item
 * @param item2 Second menu item
 * @returns Similarity score between 0 and 1
 */
export const calculateSimilarityScore = (item1: MenuItem, item2: MenuItem): number => {
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
 * Finds related menu items based on similarity to a selected item
 * @param items All available menu items
 * @param selectedItem The item to find related items for
 * @param count Number of recommendations to return
 * @returns Array of recommended menu items
 */
export const findRelatedItems = (
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
  const similarityScores = otherItems.map(item => ({
    item,
    score: calculateSimilarityScore(selectedItem, item)
  }));

  // Trier par score de similarité et prendre les N plus similaires
  return similarityScores
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(scoredItem => scoredItem.item);
};

export default {
  calculateSimilarityScore,
  findRelatedItems
};
