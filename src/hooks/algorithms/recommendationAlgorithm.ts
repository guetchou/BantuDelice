
import { MenuItem } from '@/types/menu';

/**
 * Recommends related menu items based on a selected item
 * @param allItems All menu items
 * @param selectedItem The currently selected menu item
 * @param limit Maximum number of items to recommend
 * @returns Array of recommended items
 */
export const recommendRelatedItems = (
  allItems: MenuItem[],
  selectedItem: MenuItem | null,
  limit: number = 3
): MenuItem[] => {
  if (!selectedItem || !allItems || allItems.length === 0) {
    return [];
  }

  // Calculate relevance scores for each item
  const scoredItems = allItems
    .filter(item => item.id !== selectedItem.id) // Exclude the selected item
    .map(item => {
      // Initialize score
      let score = 0;

      // Same category gets a high score
      if (item.category === selectedItem.category) {
        score += 3;
      }

      // Similar price range
      const priceDiff = Math.abs(item.price - selectedItem.price);
      const priceRatio = priceDiff / selectedItem.price;
      if (priceRatio < 0.2) { // Within 20% of price
        score += 2;
      }

      // Dietary preferences match
      if (
        (selectedItem.is_vegetarian && item.is_vegetarian) ||
        (selectedItem.is_vegan && item.is_vegan) ||
        (selectedItem.is_gluten_free && item.is_gluten_free)
      ) {
        score += 2;
      }

      // Good for combinations (entrée + plat, plat + dessert)
      if (
        (selectedItem.category === 'Entrées' && item.category === 'Plats Principaux') ||
        (selectedItem.category === 'Plats Principaux' && item.category === 'Desserts') ||
        (selectedItem.category === 'Boissons' && (item.category !== 'Boissons'))
      ) {
        score += 2;
      }

      // Add popularity as a factor
      if (item.popularity_score) {
        score += item.popularity_score * 2;
      }

      return { item, score };
    });

  // Sort by score and return the top items
  return scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(scoredItem => scoredItem.item);
};
