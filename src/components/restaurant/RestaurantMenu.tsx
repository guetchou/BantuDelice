
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { SearchIcon, AlertCircle, Plus, Clock, Tag, Leaf, SlidersHorizontal } from "lucide-react";
import { MenuItem } from '@/types/menu';
import SmartFilters from './SmartFilters';

interface RestaurantMenuProps {
  restaurantId: string;
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ restaurantId }) => {
  const { toast } = useToast();
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
  const filteredItems = React.useMemo(() => {
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
  
  const groupedItems = React.useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    
    filteredItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  }, [filteredItems]);
  
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
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement du menu...</p>
      </div>
    );
  }
  
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
        <div className="text-center p-8 border rounded-md">
          <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="font-medium mb-1">Aucun résultat</h3>
          <p className="text-sm text-muted-foreground">
            Aucun plat ne correspond à vos critères de recherche
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Effacer les filtres
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface MenuItemProps {
  item: MenuItem;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier`
    });
  };
  
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      {item.image_url && (
        <div className="relative h-36 overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          {(item.is_vegetarian || item.is_vegan || item.is_gluten_free) && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {item.is_vegetarian && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  <span className="text-xs">Végétarien</span>
                </Badge>
              )}
              {item.is_vegan && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">Vegan</Badge>
              )}
              {item.is_gluten_free && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Sans Gluten</Badge>
              )}
            </div>
          )}
        </div>
      )}
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="mb-auto">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium">{item.name}</h3>
            <Badge variant="outline" className="font-semibold">
              {item.price.toLocaleString('fr-FR')} FCFA
            </Badge>
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{item.preparation_time || 15} min</span>
          </div>
          <Button size="sm" onClick={handleAddToCart}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantMenu;
