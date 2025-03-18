
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, MapPin, List, Grid } from 'lucide-react';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import RestaurantMap from '@/components/restaurants/RestaurantMap';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import CategoryList from '@/components/restaurants/CategoryList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Importing types from restaurant.d.ts
interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine_type: string[] | string;
  rating?: number;
  average_rating?: number;
  logo_url?: string;
  banner_image_url?: string;
  price_range: number;
  status: string;
}

interface RestaurantFilters {
  cuisine: string[];
  price: number[];
  rating: number | null;
  distance: number | null;
  openNow: boolean;
  sortBy: string;
}

type RestaurantViewMode = 'grid' | 'map' | 'list';

const Restaurants = () => {
  const [viewMode, setViewMode] = useState<RestaurantViewMode>('grid');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<RestaurantFilters>({
    cuisine: [],
    price: [],
    rating: null,
    distance: null,
    openNow: false,
    sortBy: 'rating'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, restaurants, searchTerm]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('average_rating', { ascending: false });

      if (error) throw error;

      setRestaurants(data || []);
      setFilteredRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les restaurants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...restaurants];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (filters.cuisine.length > 0) {
      result = result.filter(restaurant => {
        let cuisines = restaurant.cuisine_type;
        if (typeof cuisines === 'string') {
          cuisines = [cuisines];
        }
        return filters.cuisine.some(c => 
          Array.isArray(cuisines) && cuisines.includes(c)
        );
      });
    }

    // Apply price filter
    if (filters.price.length > 0) {
      result = result.filter(restaurant => 
        filters.price.includes(restaurant.price_range)
      );
    }

    // Apply rating filter
    if (filters.rating) {
      result = result.filter(restaurant => 
        (restaurant.average_rating || restaurant.rating || 0) >= filters.rating!
      );
    }

    // Apply open now filter
    if (filters.openNow) {
      result = result.filter(restaurant => 
        restaurant.status === 'open'
      );
    }

    // Apply sorting
    if (filters.sortBy === 'rating') {
      result.sort((a, b) => (b.average_rating || b.rating || 0) - (a.average_rating || a.rating || 0));
    } else if (filters.sortBy === 'price') {
      result.sort((a, b) => a.price_range - b.price_range);
    }
    // Distance sorting would be handled separately

    setFilteredRestaurants(result);
  };

  const handleFilterChange = (newFilters: Partial<RestaurantFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1 w-full">
          <h1 className="text-3xl font-bold mb-2">Restaurants</h1>
          <p className="text-muted-foreground mb-4">
            Découvrez les meilleurs restaurants près de chez vous
          </p>
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Rechercher un restaurant, un type de cuisine..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4 mr-1" />
            Grille
          </Button>
          <Button 
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setViewMode('map')}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Carte
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-1" />
            Liste
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <RestaurantFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="lg:col-span-9">
          <CategoryList 
            selectedCategories={filters.cuisine}
            onCategoryChange={(categories) => handleFilterChange({ cuisine: categories })} 
          />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full" />
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-16 border rounded-lg">
              <p className="text-lg text-muted-foreground">
                Aucun restaurant ne correspond à vos critères
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setFilters({
                    cuisine: [],
                    price: [],
                    rating: null,
                    distance: null,
                    openNow: false,
                    sortBy: 'rating'
                  });
                  setSearchTerm('');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div>
              {viewMode === 'grid' && (
                <RestaurantGrid restaurants={filteredRestaurants} />
              )}
              
              {viewMode === 'map' && (
                <RestaurantMap restaurants={filteredRestaurants} />
              )}
              
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {filteredRestaurants.map(restaurant => (
                    <div 
                      key={restaurant.id}
                      className="p-4 border rounded-lg flex gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    >
                      <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {restaurant.logo_url ? (
                          <img 
                            src={restaurant.logo_url} 
                            alt={restaurant.name}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <Layout className="h-8 w-8 text-primary/50" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                          {restaurant.description}
                        </p>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{restaurant.address}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-sm ${i < (restaurant.average_rating || restaurant.rating || 0) 
                                  ? 'text-yellow-500' 
                                  : 'text-muted'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground ml-2">
                            {restaurant.average_rating || restaurant.rating || 0}/5
                          </span>
                          <span className="mx-2">•</span>
                          <span className="text-sm">
                            {"$".repeat(restaurant.price_range)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
