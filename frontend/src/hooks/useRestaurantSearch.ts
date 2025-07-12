
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RestaurantSearchProps {
  initialQuery?: string;
  cuisineFilter?: string;
  priceRange?: string;
  sortBy?: string;
}

export function useRestaurantSearch({
  initialQuery = '',
  cuisineFilter = 'Tout',
  priceRange = 'all',
  sortBy = 'popularity'
}: RestaurantSearchProps = {}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(cuisineFilter);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRange);
  const [selectedSortBy, setSelectedSortBy] = useState(sortBy);
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Fetch cuisine types
  useEffect(() => {
    const fetchCuisineTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('cuisine_type')
          .not('cuisine_type', 'is', null);
          
        if (error) throw error;
        
        // Extract unique cuisine types
        const uniqueCuisineTypes = Array.from(
          new Set(data.map(item => item.cuisine_type))
        ).filter(Boolean);
        
        setCuisineTypes(['Tout', ...uniqueCuisineTypes.sort()]);
      } catch (error) {
        console.error('Error fetching cuisine types:', error);
        toast.error('Impossible de charger les catégories de cuisine');
      }
    };
    
    fetchCuisineTypes();
  }, []);
  
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);
  
  const handlePriceRangeChange = useCallback((range: string) => {
    setSelectedPriceRange(range);
  }, []);
  
  const handleSortByChange = useCallback((sortOption: string) => {
    setSelectedSortBy(sortOption);
  }, []);
  
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('Tout');
    setSelectedPriceRange('all');
    setSelectedSortBy('popularity');
  }, []);
  
  return {
    searchQuery,
    debouncedSearchQuery,
    selectedCategory,
    selectedPriceRange,
    selectedSortBy,
    cuisineTypes,
    isLoading,
    setIsLoading,
    handleSearchChange,
    handleCategoryChange,
    handlePriceRangeChange,
    handleSortByChange,
    resetFilters
  };
}
