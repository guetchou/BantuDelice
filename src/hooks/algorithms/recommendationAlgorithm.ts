
import { MenuItem } from "@/types/menu";

/**
 * Recommends related menu items based on the current selected item
 * Uses category, paired items, and ingredient similarity for recommendations
 */
export const recommendRelatedItems = (
  currentItem: MenuItem | null,
  allItems: MenuItem[]
): MenuItem[] => {
  if (!currentItem) return [];
  
  // Critères de recommandation: même catégorie, ingrédients similaires, ou paires suggérées
  return allItems
    .filter(item => 
      item.id !== currentItem.id && (
        item.category === currentItem.category ||
        (currentItem.pairs_well_with && currentItem.pairs_well_with.includes(item.id)) ||
        (currentItem.ingredients && item.ingredients && 
          currentItem.ingredients.some(ing => item.ingredients?.includes(ing)))
      )
    )
    .sort((a, b) => {
      // Calcul de score de pertinence
      let scoreA = 0;
      let scoreB = 0;
      
      // Bonus pour les paires suggérées
      if (currentItem.pairs_well_with?.includes(a.id)) scoreA += 3;
      if (currentItem.pairs_well_with?.includes(b.id)) scoreB += 3;
      
      // Bonus pour même catégorie
      if (a.category === currentItem.category) scoreA += 1;
      if (b.category === currentItem.category) scoreB += 1;
      
      // Bonus pour ingrédients communs
      if (currentItem.ingredients && a.ingredients) {
        const commonIngredientsA = currentItem.ingredients.filter(ing => 
          a.ingredients?.includes(ing)
        ).length;
        scoreA += commonIngredientsA * 0.5;
      }
      
      if (currentItem.ingredients && b.ingredients) {
        const commonIngredientsB = currentItem.ingredients.filter(ing => 
          b.ingredients?.includes(ing)
        ).length;
        scoreB += commonIngredientsB * 0.5;
      }
      
      return scoreB - scoreA;
    })
    .slice(0, 3); // Limiter à 3 recommandations
};
