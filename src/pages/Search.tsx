
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon, Coffee, Car, Users, MapPin } from 'lucide-react';
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import SEO from '@/components/SEO';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { Skeleton } from "@/components/ui/skeleton";

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentTab, setCurrentTab] = useState('restaurants');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Simuler des résultats de recherche basés sur la requête
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    
    // Simuler un appel API
    setTimeout(() => {
      const mockRestaurants = [
        {
          id: 'rest1',
          name: 'Le Gourmet Congolais',
          cuisine_type: 'Cuisine congolaise',
          banner_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
          average_rating: 4.7,
          delivery_fee: 0,
          average_prep_time: 25
        },
        {
          id: 'rest2',
          name: 'Saveurs d\'Afrique',
          cuisine_type: 'Panafricaine',
          banner_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          average_rating: 4.5,
          delivery_fee: 1500,
          average_prep_time: 35
        },
        {
          id: 'rest3',
          name: 'Chez Matou',
          cuisine_type: 'Fast Food',
          banner_image_url: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=1964&auto=format&fit=crop',
          average_rating: 4.2,
          delivery_fee: 2000,
          average_prep_time: 20
        },
      ].filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(mockRestaurants);
      setLoading(false);
    }, 1000);
  }, [searchQuery, currentTab]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL query parameter
    const newUrl = `${location.pathname}?q=${encodeURIComponent(searchQuery)}`;
    window.history.pushState({}, '', newUrl);
  };
  
  const getTabContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      );
    }
    
    if (searchResults.length === 0 && searchQuery.trim()) {
      return (
        <div className="text-center py-16">
          <div className="mb-4">
            <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">Aucun résultat trouvé</h3>
          <p className="mt-2 text-gray-500">
            Nous n'avons trouvé aucun résultat pour "{searchQuery}". 
            Essayez avec un terme différent.
          </p>
        </div>
      );
    }
    
    switch (currentTab) {
      case 'restaurants':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        );
      case 'taxi':
      case 'covoiturage':
      case 'services':
        return (
          <div className="text-center py-16">
            <div className="mb-4">
              {currentTab === 'taxi' && <Car className="mx-auto h-12 w-12 text-gray-400" />}
              {currentTab === 'covoiturage' && <Users className="mx-auto h-12 w-12 text-gray-400" />}
              {currentTab === 'services' && <MapPin className="mx-auto h-12 w-12 text-gray-400" />}
            </div>
            <h3 className="text-xl font-medium text-gray-900">Recherche {currentTab}</h3>
            <p className="mt-2 text-gray-500">
              Cette fonctionnalité sera disponible prochainement.
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={`Recherche: ${searchQuery || 'Tous les résultats'} | Buntudelice`}
        description={`Résultats de recherche pour "${searchQuery}" - Restaurants, taxis et services à Kinshasa`}
        keywords={`recherche, ${searchQuery}, restaurants, taxi, Kinshasa`}
      />
      
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Accueil', path: '/' },
          { label: 'Recherche', path: '/search' },
        ]} />
      </div>

      <h1 className="text-3xl font-bold mb-6">Recherche</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Rechercher un restaurant, un plat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit">
              <SearchIcon className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </form>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            <span>Restaurants</span>
          </TabsTrigger>
          <TabsTrigger value="taxi" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>Taxis</span>
          </TabsTrigger>
          <TabsTrigger value="covoiturage" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Covoiturage</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Services</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentTab} className="pt-4">
          {getTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
