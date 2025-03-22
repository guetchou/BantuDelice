
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MenuItem } from '@/types/menu'; // Import from types not from component
import SmartFilters from './SmartFilters';
import { AlertCircle } from "lucide-react";
import CategorySection from './menu/CategorySection';
import NoResults from './menu/NoResults';

interface RestaurantMenuProps {
  restaurantId: string;
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ restaurantId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  
  const { data: menuItems, isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ['menu', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('category', { ascending: true });
        
      if (error) throw error;
      
      return data as MenuItem[];
    }
  });
  
  const categories = Array.from(new Set((menuItems || []).map(item => item.category)));
  const maxPrice = Math.max(...(menuItems || []).map(item => item.price), 0);
  const minPrice = Math.min(...(menuItems || []).map(item => item.price > 0 ? item.price : Infinity), 0);
  
  useEffect(() => {
    if (menuItems && priceRange[1] === 100000) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [menuItems, minPrice, maxPrice, priceRange]);
  
  // Filtrage des éléments en fonction des critères
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    
    return menuItems.filter(item => {
      // Filtre de recherche
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filtre de catégorie
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }
      
      // Filtres diététiques
      if (dietaryFilters.vegetarian && !item.is_vegetarian) return false;
      if (dietaryFilters.vegan && !item.is_vegan) return false;
      if (dietaryFilters.glutenFree && !item.is_gluten_free) return false;
      
      // Filtre de prix
      if (item.price < priceRange[0] || item.price > priceRange[1]) return false;
      
      return true;
    });
  }, [menuItems, searchQuery, selectedCategories, dietaryFilters, priceRange]);
  
  // Group items by category
  const groupedItems = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    
    filteredItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  }, [filteredItems]);
  
  // Handler functions
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };
  
  const handleDietaryChange = (type: 'vegetarian' | 'vegan' | 'glutenFree', value: boolean) => {
    setDietaryFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setDietaryFilters({
      vegetarian: false,
      vegan: false,
      glutenFree: false
    });
    setPriceRange([minPrice, maxPrice]);
    setSearchQuery('');
  };
  
  const activeFiltersCount = 
    selectedCategories.length +
    Object.values(dietaryFilters).filter(Boolean).length +
    (priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0) +
    (searchQuery ? 1 : 0);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement du menu...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement du menu. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Empty menu state
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="p-4 text-center border rounded-md">
        <p className="text-gray-600">Aucun plat disponible pour le moment.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <SmartFilters 
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoriesChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        maxPrice={maxPrice}
        minPrice={minPrice}
        dietaryFilters={dietaryFilters}
        onDietaryChange={handleDietaryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
      />
      
      {filteredItems.length === 0 ? (
        <NoResults onClearFilters={clearFilters} />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <CategorySection key={category} category={category} items={items} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
