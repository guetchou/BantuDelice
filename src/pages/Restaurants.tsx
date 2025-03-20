
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, SlidersHorizontal, MapPin, 
  CheckCircle, XCircle, Clock, TrendingUp, 
} from "lucide-react";
import Layout from '@/components/Layout';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import type { Restaurant } from '@/types/restaurant';

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [cuisineFilter, setCuisineFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<number[]>([]);
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'time'>('distance');
  const [availableCuisines, setAvailableCuisines] = useState<string[]>([]);
  
  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('average_rating', { ascending: false });
        
      if (error) throw error;
      
      return data as Restaurant[];
    }
  });
  
  useEffect(() => {
    if (restaurants) {
      // Extract unique cuisines
      const cuisines = new Set<string>();
      
      restaurants.forEach(restaurant => {
        if (Array.isArray(restaurant.cuisine_type)) {
          restaurant.cuisine_type.forEach(cuisine => cuisines.add(cuisine));
        } else if (typeof restaurant.cuisine_type === 'string') {
          cuisines.add(restaurant.cuisine_type);
        }
      });
      
      setAvailableCuisines(Array.from(cuisines));
    }
  }, [restaurants]);
  
  // Apply filters and sorting
  const filteredRestaurants = React.useMemo(() => {
    if (!restaurants) return [];
    
    let filtered = [...restaurants];
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(restaurant.cuisine_type) && 
          restaurant.cuisine_type.some(cuisine => 
            cuisine.toLowerCase().includes(searchQuery.toLowerCase())
          ))
      );
    }
    
    // Apply cuisine filter
    if (cuisineFilter.length > 0) {
      filtered = filtered.filter(restaurant => {
        if (Array.isArray(restaurant.cuisine_type)) {
          return restaurant.cuisine_type.some(cuisine => 
            cuisineFilter.includes(cuisine)
          );
        } else {
          return cuisineFilter.includes(restaurant.cuisine_type as string);
        }
      });
    }
    
    // Apply price filter
    if (priceFilter.length > 0) {
      filtered = filtered.filter(restaurant => 
        priceFilter.includes(restaurant.price_range)
      );
    }
    
    // Apply open now filter
    if (openNowFilter) {
      filtered = filtered.filter(restaurant => restaurant.is_open);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'time':
        filtered.sort((a, b) => a.average_prep_time - b.average_prep_time);
        break;
      case 'distance':
        // In a real app, you would calculate actual distance
        // Here we're just using a different sorting for demonstration
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return filtered;
  }, [restaurants, searchQuery, cuisineFilter, priceFilter, openNowFilter, sortBy]);
  
  const toggleCuisineFilter = (cuisine: string) => {
    if (cuisineFilter.includes(cuisine)) {
      setCuisineFilter(cuisineFilter.filter(c => c !== cuisine));
    } else {
      setCuisineFilter([...cuisineFilter, cuisine]);
    }
  };
  
  const togglePriceFilter = (price: number) => {
    if (priceFilter.includes(price)) {
      setPriceFilter(priceFilter.filter(p => p !== price));
    } else {
      setPriceFilter([...priceFilter, price]);
    }
  };
  
  const clearFilters = () => {
    setCuisineFilter([]);
    setPriceFilter([]);
    setOpenNowFilter(false);
    setSortBy('distance');
    setSearchQuery('');
  };
  
  return (
    <Layout hideBackButton>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
        
        <div className="mb-8 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un restaurant, un plat..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant={filterOpen ? "default" : "outline"} 
            onClick={() => setFilterOpen(!filterOpen)}
            size="icon"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        {filterOpen && (
          <div className="mb-8 p-4 border rounded-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Filtres</h2>
              <Button 
                variant="ghost" 
                onClick={clearFilters} 
                className="text-sm h-8 px-2"
              >
                Réinitialiser
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Cuisine</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCuisines.map(cuisine => (
                    <Button
                      key={cuisine}
                      variant={cuisineFilter.includes(cuisine) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCuisineFilter(cuisine)}
                      className="text-xs h-7"
                    >
                      {cuisine}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Prix</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(price => (
                    <Button
                      key={price}
                      variant={priceFilter.includes(price) ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePriceFilter(price)}
                      className="text-xs h-7"
                    >
                      {Array(price).fill('₣').join('')}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Disponibilité</h3>
                <Button
                  variant={openNowFilter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOpenNowFilter(!openNowFilter)}
                  className="flex items-center text-xs h-8"
                >
                  {openNowFilter ? (
                    <CheckCircle className="mr-2 h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="mr-2 h-3.5 w-3.5" />
                  )}
                  Ouvert maintenant
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <Tabs defaultValue={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="distance" className="text-xs">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                Distance
              </TabsTrigger>
              <TabsTrigger value="rating" className="text-xs">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Popularité
              </TabsTrigger>
              <TabsTrigger value="time" className="text-xs">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Temps de livraison
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500">Aucun restaurant ne correspond à votre recherche.</p>
            <Button variant="link" onClick={clearFilters}>Effacer les filtres</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
