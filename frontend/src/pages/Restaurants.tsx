
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Clock, 
  Filter, 
  ArrowUpDown, 
  Star,
  ChevronDown,
  X
} from 'lucide-react';
import ImprovedRestaurantCard from '@/components/restaurants/ImprovedRestaurantCard';
import { supabase } from '@/integrations/supabase/client';
import { useRestaurantSearch } from '@/hooks/useRestaurantSearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  
  const { 
    searchQuery, 
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
  } = useRestaurantSearch();
  
  // Obtenir les restaurants lors du changement des filtres
  useEffect(() => {
    fetchRestaurants();
  }, [selectedCategory, selectedPriceRange, selectedSortBy, searchQuery]);
  
  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('restaurants')
        .select('*')
        .order('name');
      
      // Appliquer les filtres
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      if (selectedCategory && selectedCategory !== 'Tout') {
        query = query.eq('cuisine_type', selectedCategory);
      }
      
      // Obtenir les résultats
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Filtrer par fourchette de prix client-side (comme c'est plus complexe avec Supabase)
      let filteredData = data;
      
      if (selectedPriceRange !== 'all') {
        // Ces logiques seraient normalement basées sur des champs dans votre base de données
        filteredData = data.filter(restaurant => {
          const avgPrice = restaurant.min_order_amount || 5000;
          switch (selectedPriceRange) {
            case 'low': return avgPrice < 5000;
            case 'medium': return avgPrice >= 5000 && avgPrice <= 15000;
            case 'high': return avgPrice > 15000;
            default: return true;
          }
        });
      }
      
      // Trier les résultats
      filteredData = filteredData.sort((a, b) => {
        switch (selectedSortBy) {
          case 'popularity':
            return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || 
                   (b.rating || 0) - (a.rating || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'price_asc':
            return (a.min_order_amount || 0) - (b.min_order_amount || 0);
          case 'price_desc':
            return (b.min_order_amount || 0) - (a.min_order_amount || 0);
          case 'nearest':
            // Simuler la proximité pour cette démo
            return (a.latitude ? 1 : 0) - (b.latitude ? 1 : 0);
          default:
            return 0;
        }
      });
      
      setRestaurants(filteredData);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurants/${id}`);
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'Tout') count++;
    if (selectedPriceRange !== 'all') count++;
    if (selectedSortBy !== 'popularity') count++;
    return count;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un restaurant, une cuisine..."
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      {/* Filtres */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres
                {getActiveFiltersCount() > 0 && (
                  <Badge className="ml-1 bg-primary/90 hover:bg-primary">{getActiveFiltersCount()}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Catégorie</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {cuisineTypes.map(cuisine => (
                <DropdownMenuCheckboxItem
                  key={cuisine}
                  checked={selectedCategory === cuisine}
                  onCheckedChange={() => handleCategoryChange(cuisine)}
                >
                  {cuisine}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Fourchette de prix</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedPriceRange === 'all'}
                onCheckedChange={() => handlePriceRangeChange('all')}
              >
                Tous les prix
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedPriceRange === 'low'}
                onCheckedChange={() => handlePriceRangeChange('low')}
              >
                Économique
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedPriceRange === 'medium'}
                onCheckedChange={() => handlePriceRangeChange('medium')}
              >
                Moyen
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedPriceRange === 'high'}
                onCheckedChange={() => handlePriceRangeChange('high')}
              >
                Élevé
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Trier par
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem
                checked={selectedSortBy === 'popularity'}
                onCheckedChange={() => handleSortByChange('popularity')}
              >
                Popularité
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSortBy === 'rating'}
                onCheckedChange={() => handleSortByChange('rating')}
              >
                <Star className="mr-2 h-4 w-4" />
                Note
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSortBy === 'price_asc'}
                onCheckedChange={() => handleSortByChange('price_asc')}
              >
                Prix croissant
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSortBy === 'price_desc'}
                onCheckedChange={() => handleSortByChange('price_desc')}
              >
                Prix décroissant
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSortBy === 'nearest'}
                onCheckedChange={() => handleSortByChange('nearest')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Distance
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSortBy === 'fastest'}
                onCheckedChange={() => handleSortByChange('fastest')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Temps de livraison
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Filtres actifs */}
          {selectedCategory !== 'Tout' && (
            <Badge variant="secondary" className="gap-1 pl-2 h-9">
              {selectedCategory}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-1 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                onClick={() => handleCategoryChange('Tout')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedPriceRange !== 'all' && (
            <Badge variant="secondary" className="gap-1 pl-2 h-9">
              Prix: {selectedPriceRange === 'low' ? 'Économique' : selectedPriceRange === 'medium' ? 'Moyen' : 'Élevé'}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-1 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                onClick={() => handlePriceRangeChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          {restaurants.length} résultat{restaurants.length > 1 ? 's' : ''} trouvé{restaurants.length > 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Affichage des restaurants */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="border border-gray-200 border-t-0 p-4 rounded-b-lg">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <ImprovedRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex rounded-full bg-yellow-100 p-4 mb-4">
                <Search className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Aucun restaurant trouvé</h3>
              <p className="text-gray-500 mb-6">
                Aucun restaurant ne correspond à vos critères de recherche.
              </p>
              <Button onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
