
import { MenuItem } from '@/types/menu';

interface FilterOptions {
  categories?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
  };
  keyword?: string;
  includeUnavailable?: boolean;
}

/**
 * Applies smart filtering to menu items
 * @param items Menu items to filter
 * @param filters Filtering options
 * @returns Filtered menu items
 */
export const applySmartFilter = (
  items: MenuItem[],
  filters: FilterOptions
): MenuItem[] => {
  if (!items || items.length === 0) {
    return [];
  }

  return items.filter(item => {
    // Filter by availability
    if (!filters.includeUnavailable && !item.available) {
      return false;
    }

    // Filter by category
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(item.category)) {
      return false;
    }

    // Filter by price range
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined && item.price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== undefined && item.price > filters.priceRange.max) {
        return false;
      }
    }

    // Filter by dietary preferences
    if (filters.dietary) {
      if (filters.dietary.vegetarian && !item.is_vegetarian) {
        return false;
      }
      if (filters.dietary.vegan && !item.is_vegan) {
        return false;
      }
      if (filters.dietary.glutenFree && !item.is_gluten_free) {
        return false;
      }
    }

    // Filter by keyword (search in name and description)
    if (filters.keyword && filters.keyword.trim() !== '') {
      const keyword = filters.keyword.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(keyword);
      const descriptionMatch = item.description ? item.description.toLowerCase().includes(keyword) : false;
      
      if (!nameMatch && !descriptionMatch) {
        return false;
      }
    }

    return true;
  });
};
