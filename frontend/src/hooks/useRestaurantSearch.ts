
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import apiService from '@/services/apiService';
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
        // Données mockées pour l'instant
        const mockCuisineTypes = [
          'Tout',
          'Congolaise',
          'Panafricaine',
          'Fast Food',
          'Française',
          'Italienne',
          'Chinoise',
          'Japonaise',
          'Mexicaine',
          'Indienne',
          'Libanaise',
          'Américaine'
        ];
        
        setCuisineTypes(mockCuisineTypes);
      } catch (error) {
        console.error('Error fetching cuisine types:', error);
        // Fallback avec des types de base
        setCuisineTypes(['Tout', 'Congolaise', 'Panafricaine', 'Fast Food', 'Française', 'Italienne']);
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
