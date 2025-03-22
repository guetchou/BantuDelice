
import { MenuItem } from "@/types/menu";

// Algorithme 1: Système de recommandation basé sur les relations entre plats
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

// Algorithme 2: Filtrage intelligent avec pondération multiple
export const applySmartFilter = (
  items: MenuItem[],
  filters: {
    categories?: string[];
    dietary?: {
      vegetarian?: boolean;
      vegan?: boolean;
      glutenFree?: boolean;
    };
    priceRange?: {
      min?: number;
      max?: number;
    };
    keyword?: string;
    includeUnavailable?: boolean;
  }
) => {
  return items.filter(item => {
    // Filtre de disponibilité
    if (!filters.includeUnavailable && !item.available) return false;
    
    // Filtre de catégorie
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(item.category)) return false;
    }
    
    // Filtres diététiques
    if (filters.dietary) {
      if (filters.dietary.vegetarian && item.is_vegetarian === false) return false;
      if (filters.dietary.vegan && item.is_vegan === false) return false;
      if (filters.dietary.glutenFree && item.is_gluten_free === false) return false;
    }
    
    // Filtre de prix
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined && item.price < filters.priceRange.min) return false;
      if (filters.priceRange.max !== undefined && item.price > filters.priceRange.max) return false;
    }
    
    // Recherche par mot-clé (nom, description ou ingrédients)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(keyword);
      const descMatch = item.description?.toLowerCase().includes(keyword);
      const ingredientsMatch = item.ingredients?.some(ing => 
        ing.toLowerCase().includes(keyword)
      );
      
      if (!nameMatch && !descMatch && !ingredientsMatch) return false;
    }
    
    return true;
  });
};

// Intelligence 1: Analyse du menu et statistiques
export const analyzeMenu = (items: MenuItem[]) => {
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

// Intelligence 2: Génération de suggestions pour améliorer le menu
export const generateMenuSuggestions = (menuAnalysis: any, allItems: MenuItem[]) => {
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
