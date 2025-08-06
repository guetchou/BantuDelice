
import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@/types/menu';
import { restaurantApi } from '@/integrations/api/restaurants';
import { useToast } from '@/hooks/use-toast';
import {
  recommendRelatedItems,
  applySmartFilter,
  analyzeMenu,
  generateMenuSuggestions
} from './useMenuAlgorithms';

interface FilterState {
  keyword: string;
  categories: string[];
  priceRange: {
    min?: number;
    max?: number;
  };
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  includeUnavailable: boolean;
}

export const useMenuEnhanced = (restaurantId: string) => {
  const { toast } = useToast();
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    categories: [],
    priceRange: Record<string, unknown>,
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false
    },
    includeUnavailable: false
  });
  
  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!restaurantId) return;
      
      try {
        setLoading(true);
        const data = await restaurantApi.getMenu(restaurantId);
        setAllItems(data as MenuItem[]);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch menu'));
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le menu',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, [restaurantId, toast]);
  
  // Apply filters to menu items
  const filteredItems = useMemo(() => {
    return applySmartFilter(allItems, filters);
  }, [allItems, filters]);
  
  // Get recommended items based on selected item
  const recommendedItems = useMemo(() => {
    return recommendRelatedItems(allItems, selectedItem, 3);
  }, [allItems, selectedItem]);
  
  // Generate menu analysis
  const menuAnalysis = useMemo(() => {
    return analyzeMenu(allItems);
  }, [allItems]);
  
  // Generate menu suggestions
  const menuSuggestions = useMemo(() => {
    return generateMenuSuggestions(allItems);
  }, [allItems]);
  
  // Get all available categories
  const getAvailableCategories = useMemo(() => {
    return Array.from(new Set(allItems.map(item => item.category)));
  }, [allItems]);
  
  // Update filters function
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      keyword: '',
      categories: [],
      priceRange: Record<string, unknown>,
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false
      },
      includeUnavailable: false
    });
  };
  
  // Select an item for recommendations
  const selectItem = (item: MenuItem | null) => {
    setSelectedItem(item);
  };
  
  return {
    allItems,
    filteredItems,
    isLoading: loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    selectedItem,
    selectItem,
    recommendedItems,
    menuAnalysis,
    menuSuggestions,
    getAvailableCategories
  };
};
