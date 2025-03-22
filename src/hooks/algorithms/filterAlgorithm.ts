
import { MenuItem } from "@/types/menu";

/**
 * Advanced filtering system for menu items with multiple criteria and weighting
 */
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
