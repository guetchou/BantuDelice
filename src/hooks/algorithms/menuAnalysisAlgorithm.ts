
import { MenuItem, MenuAnalytics } from "@/types/menu";

/**
 * Analyzes menu data to provide statistical insights and metrics
 */
export const analyzeMenu = (items: MenuItem[]): MenuAnalytics | null => {
  if (!items.length) return null;
  
  // Catégorisation et comptage
  const categories: Record<string, number> = {};
  const pricePoints: number[] = [];
  let totalPrice = 0;
  let vegetarianCount = 0;
  let veganCount = 0;
  let glutenFreeCount = 0;
  
  items.forEach(item => {
    // Comptage par catégorie
    categories[item.category] = (categories[item.category] || 0) + 1;
    
    // Statistiques de prix
    pricePoints.push(item.price);
    totalPrice += item.price;
    
    // Comptage des options alimentaires
    if (item.is_vegetarian) vegetarianCount++;
    if (item.is_vegan) veganCount++;
    if (item.is_gluten_free) glutenFreeCount++;
  });
  
  // Trouver la catégorie la plus populaire
  const mostPopularCategory = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Statistiques de prix
  const averagePrice = totalPrice / items.length;
  const minPrice = Math.min(...pricePoints);
  const maxPrice = Math.max(...pricePoints);
  
  return {
    totalItems: items.length,
    categories,
    mostPopularCategory,
    priceStats: {
      average: averagePrice,
      min: minPrice,
      max: maxPrice,
      range: maxPrice - minPrice
    },
    dietaryOptions: {
      vegetarianPercentage: (vegetarianCount / items.length) * 100,
      veganPercentage: (veganCount / items.length) * 100,
      glutenFreePercentage: (glutenFreeCount / items.length) * 100
    }
  };
};
