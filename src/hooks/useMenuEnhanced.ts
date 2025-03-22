
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '@/types/menu';
import { toast } from 'sonner';
import { 
  recommendRelatedItems, 
  applySmartFilter, 
  analyzeMenu, 
  generateMenuSuggestions 
} from './useMenuAlgorithms';

export const useMenuEnhanced = (restaurantId: string) => {
  const [filters, setFilters] = useState({
    categories: [],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false
    },
    priceRange: {
      min: undefined,
      max: undefined
    },
    keyword: '',
    includeUnavailable: false
  });
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Récupération de tous les éléments du menu
  const { data: allItems, isLoading, error } = useQuery({
    queryKey: ['menu-items-enhanced', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId);
        
        if (error) throw error;
        return data as MenuItem[];
      } catch (err) {
        console.error('Error fetching menu items:', err);
        toast.error('Impossible de charger le menu');
        return [];
      }
    },
    enabled: !!restaurantId
  });
  
  // Intelligence 2: Statistiques du menu et analyse
  const menuAnalysis = useMemo(() => {
    if (allItems && allItems.length > 0) {
      return analyzeMenu(allItems);
    }
    return null;
  }, [allItems]);
  
  // Filtrage intelligent des éléments
  const filteredItems = useMemo(() => {
    if (!allItems) return [];
    return applySmartFilter(allItems, filters);
  }, [allItems, filters]);
  
  // Éléments recommandés basés sur l'élément sélectionné
  const recommendedItems = useMemo(() => {
    if (!allItems) return [];
    return recommendRelatedItems(selectedItem, allItems);
  }, [selectedItem, allItems]);
  
  // Intelligence 3: Suggestions pour améliorer le menu
  const menuSuggestions = useMemo(() => {
    return generateMenuSuggestions(menuAnalysis, allItems);
  }, [menuAnalysis, allItems]);
  
  // Fonctions avancées
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  const selectItem = (item: MenuItem) => {
    setSelectedItem(item);
  };
  
  const clearFilters = () => {
    setFilters({
      categories: [],
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false
      },
      priceRange: {
        min: undefined,
        max: undefined
      },
      keyword: '',
      includeUnavailable: false
    });
  };
  
  const getAvailableCategories = useMemo(() => {
    if (!allItems) return [];
    return [...new Set(allItems.map(item => item.category))];
  }, [allItems]);
  
  return {
    allItems,
    filteredItems,
    isLoading,
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
