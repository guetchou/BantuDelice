
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { useToast } from "@/hooks/use-toast";
import type { Restaurant } from '@/types/restaurant';

interface RestaurantGridProps {
  searchQuery: string;
  selectedCategory: string;
  priceRange: string;
  sortBy: string;
}

const RestaurantGrid = ({ searchQuery, selectedCategory, priceRange, sortBy }: RestaurantGridProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants', searchQuery, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      console.log('Fetching restaurants with filters:', { searchQuery, selectedCategory, priceRange, sortBy });
      
      try {
        let query = supabase
          .from('restaurants')
          .select('*');

        if (searchQuery) {
          query = query.textSearch('search_vector', searchQuery);
        }

        if (selectedCategory !== 'Tout') {
          query = query.eq('cuisine_type', selectedCategory);
        }

        const { data: restaurantsData, error } = await query;

        if (error) {
          console.error('Error fetching restaurants:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les restaurants",
            variant: "destructive",
          });
          throw error;
        }

        // Convertir les données en objets Restaurant correctement typés
        const typedRestaurants: Restaurant[] = (restaurantsData || []).map(restaurant => {
          // Manipuler les business_hours pour assurer la conformité au type BusinessHours
          let businessHours = {
            regular: {
              monday: { open: '08:00', close: '22:00' },
              tuesday: { open: '08:00', close: '22:00' },
              wednesday: { open: '08:00', close: '22:00' },
              thursday: { open: '08:00', close: '22:00' },
              friday: { open: '08:00', close: '22:00' },
              saturday: { open: '08:00', close: '22:00' },
              sunday: { open: '08:00', close: '22:00' }
            }
          };

          try {
            if (restaurant.business_hours) {
              const parsedHours = typeof restaurant.business_hours === 'string'
                ? JSON.parse(restaurant.business_hours)
                : restaurant.business_hours;
              
              if (parsedHours.regular) {
                businessHours = parsedHours;
              }
            }
          } catch (e) {
            console.error('Error parsing business hours:', e);
          }

          return {
            id: restaurant.id,
            name: restaurant.name || 'Restaurant sans nom',
            description: restaurant.description || '',
            address: restaurant.address || '',
            latitude: restaurant.latitude || 0,
            longitude: restaurant.longitude || 0,
            phone: restaurant.phone || '',
            email: restaurant.email || '',
            status: (restaurant.status as "open" | "closed" | "busy") || 'closed',
            average_prep_time: restaurant.average_prep_time || 30,
            banner_image_url: restaurant.banner_image_url || '',
            logo_url: restaurant.logo_url || '',
            cuisine_type: restaurant.cuisine_type || '',
            rating: restaurant.rating || 0,
            total_ratings: restaurant.total_ratings || 0,
            minimum_order: restaurant.minimum_order || 0,
            delivery_fee: restaurant.delivery_fee || 0,
            business_hours: businessHours,
            trending: restaurant.trending || false,
            special_days: []
          };
        });
        
        // Filter by price range
        let filteredData = typedRestaurants;
        
        if (priceRange !== 'all') {
          filteredData = filteredData.filter(restaurant => {
            const avgPrice = restaurant.minimum_order;
            switch(priceRange) {
              case 'low': return avgPrice < 5000;
              case 'medium': return avgPrice >= 5000 && avgPrice <= 15000;
              case 'high': return avgPrice > 15000;
              default: return true;
            }
          });
        }

        // Sort restaurants
        return filteredData.sort((a, b) => {
          switch(sortBy) {
            case 'rating':
              return (b.rating || 0) - (a.rating || 0);
            case 'preparation_time':
              return (a.average_prep_time || 30) - (b.average_prep_time || 30);
            default:
              return 0;
          }
        });
      } catch (error) {
        console.error('Error in restaurant fetching process:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les restaurants",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  const handleRestaurantClick = (restaurantId: string) => {
    console.log('Navigating to restaurant:', restaurantId);
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {Array(6).fill(0).map((_, index) => (
          <div 
            key={index}
            className="glass-card animate-pulse"
          >
            <div className="h-48 bg-white/5" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-xl">Aucun restaurant ne correspond à vos critères</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={handleRestaurantClick}
        />
      ))}
    </div>
  );
};

export default RestaurantGrid;
