
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertCircle } from "lucide-react";
import MenuItemComponent from './MenuItem';
import { CartProvider } from '@/contexts/CartContext';
import { type MenuItem } from '@/types/restaurant';

interface RestaurantMenuProps {
  restaurantId: string;
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ restaurantId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  
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
  
  useEffect(() => {
    if (menuItems) {
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(menuItems.map(item => item.category))
      );
      setCategories(uniqueCategories);
      
      // Filter items based on search and category
      let filtered = [...menuItems];
      
      if (searchQuery) {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
      
      setFilteredItems(filtered);
    }
  }, [menuItems, searchQuery, selectedCategory]);
  
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
    <CartProvider>
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un plat"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex overflow-x-auto py-1 space-x-1">
            <TabsTrigger value="all">Tous</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <MenuItemComponent 
                    key={item.id} 
                    item={item} 
                    restaurantId={restaurantId} 
                  />
                ))
              ) : (
                <div className="col-span-2 p-4 text-center border rounded-md">
                  <p className="text-gray-600">Aucun plat trouvé pour cette recherche.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CartProvider>
  );
};

export default RestaurantMenu;
