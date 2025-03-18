import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Search, SlidersHorizontal, Grid3X3, Map, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import RestaurantMap from '@/components/restaurants/RestaurantMap';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import type { Restaurant, RestaurantFilters as Filters, RestaurantViewMode } from '@/types/restaurant';
import { useTableExistence } from '@/hooks/useTableExistence';

const CUISINE_TYPES = [
  "Tout",
  "Africain",
  "Congolais",
  "Européen", 
  "Italien",
  "Asiatique",
  "Fast Food",
  "Végétarien",
  "Fruits de mer"
];

export default function Restaurants() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [viewMode, setViewMode] = useState<RestaurantViewMode>('grid');
  const [filters, setFilters] = useState<Filters>({
    cuisine: [],
    price: [],
    rating: null,
    distance: 10,
    openNow: false,
    sortBy: 'rating',
    cuisine_type: [],
    price_range: []
  });

  const { exists: tableExists } = useTableExistence('restaurants');

  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!tableExists) {
        console.log('Table restaurants does not exist yet');
        setTimeout(() => setIsLoading(false), 1000);
        return;
      }

      let query = supabase
        .from('restaurants')
        .select('*');

      if (searchQuery) {
        query = query.textSearch('search_vector', searchQuery, {
          type: 'websearch',
          config: 'english'
        });
      }

      if (filters.cuisine_type && filters.cuisine_type.length > 0) {
        query = query.in('cuisine_type', filters.cuisine_type);
      }

      if (filters.rating) {
        query = query.gte('average_rating', filters.rating);
      }

      if (filters.isOpen) {
        query = query.eq('is_open', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
      }

      const processedData = data.map(restaurant => {
        const typedRestaurant: Restaurant = {
          id: restaurant.id,
          name: restaurant.name || 'Unknown Restaurant',
          description: restaurant.description || '',
          address: restaurant.address || '',
          latitude: restaurant.latitude || 0,
          longitude: restaurant.longitude || 0,
          phone: restaurant.phone || '',
          email: restaurant.email || '',
          website: restaurant.website || '',
          logo_url: restaurant.logo_url || '',
          banner_image_url: restaurant.banner_image_url || '',
          cuisine_type: restaurant.cuisine_type || '',
          price_range: restaurant.price_range || 1,
          rating: restaurant.rating || restaurant.average_rating || 0,
          status: (restaurant.status as "open" | "closed" | "busy") || 'closed',
          business_hours: restaurant.business_hours || restaurant.opening_hours,
          total_ratings: restaurant.total_ratings || 0,
          trending: restaurant.trending || false,
          minimum_order: restaurant.minimum_order || 0,
          delivery_fee: restaurant.delivery_fee || 0,
          average_prep_time: restaurant.average_prep_time || 30,
          is_open: restaurant.is_open || false
        };
        return typedRestaurant;
      });

      setRestaurants(processedData);
      setFilteredRestaurants(processedData);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les restaurants",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, toast, tableExists]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          setUserLocation([4.0383, 9.7084]); // Douala, Cameroon
        }
      );
    }
  }, []);

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurants/${id}`);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleFindNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setViewMode('map');
          toast({
            title: "Localisation mise à jour",
            description: "Restaurants à proximité affichés sur la carte",
          });
        },
        () => {
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'accéder à votre position",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorez les restaurants</h1>
          <p className="text-gray-300">Découvrez les meilleurs restaurants de votre région</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un restaurant, un plat ou une cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <Button 
            onClick={handleFindNearMe}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Près de moi
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <RestaurantFilters
            filters={filters}
            onChange={handleFilterChange}
          />

          <div className="flex-grow">
            <Tabs 
              defaultValue="grid" 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as RestaurantViewMode)}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-3 w-[240px] bg-gray-800">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid3X3 size={16} />
                  Grille
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List size={16} />
                  Liste
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map size={16} />
                  Carte
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mb-4 flex flex-wrap gap-4">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange({ sortBy: value })}
              >
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="rating">Évaluation</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="trending">Popularité</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.cuisine_type?.length ? filters.cuisine_type[0] : "all"}
                onValueChange={(value) => handleFilterChange({ cuisine_type: value ? [value] : [] })}
              >
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Type de cuisine" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">Toutes les cuisines</SelectItem>
                  {CUISINE_TYPES.map(type => (
                    <SelectItem key={type} value={type === "Tout" ? "all" : type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <p className="text-sm text-gray-300 min-w-[120px]">Distance maximum:</p>
              <Slider
                value={[filters.distance || 10]}
                min={1}
                max={20}
                step={1}
                onValueChange={([value]) => handleFilterChange({ distance: value })}
                className="flex-1"
              />
              <span className="min-w-[60px] text-sm text-gray-300">{filters.distance || 10} km</span>
            </div>

            {viewMode === 'map' ? (
              <RestaurantMap 
                restaurants={filteredRestaurants}
                userLocation={userLocation}
                onMarkerClick={handleRestaurantClick}
                isLoading={isLoading}
              />
            ) : (
              <RestaurantGrid 
                restaurants={filteredRestaurants}
                isLoading={isLoading}
                onRestaurantClick={handleRestaurantClick}
                columns={viewMode === 'list' ? 1 : 3}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
