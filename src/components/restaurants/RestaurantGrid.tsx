import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RestaurantCard from "./RestaurantCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { createApi } from 'unsplash-js';

const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
console.log('Unsplash Access Key in RestaurantGrid:', unsplashAccessKey ? 'Present' : 'Missing');

const unsplash = createApi({
  accessKey: unsplashAccessKey || '',
  headers: {
    Authorization: `Client-ID ${unsplashAccessKey}`
  }
});

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  image_url?: string;
  rating?: number;
  estimated_preparation_time: number;
  cuisine_type?: string;
  distance?: number;
  menu_items?: MenuItem[];
}

interface RestaurantGridProps {
  searchQuery: string;
  selectedCategory: string;
  priceRange: string;
  sortBy: string;
}

const RestaurantGrid = ({ searchQuery, selectedCategory, priceRange, sortBy }: RestaurantGridProps) => {
  const navigate = useNavigate();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants', searchQuery, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      console.log('Fetching restaurants with filters:', { searchQuery, selectedCategory, priceRange, sortBy });
      
      let query = supabase
        .from('restaurants')
        .select(`
          *,
          menu_items (
            id,
            name,
            price,
            category
          )
        `);

      if (searchQuery) {
        query = query.textSearch('search_vector', searchQuery);
      }

      if (selectedCategory !== 'Tout') {
        query = query.eq('cuisine_type', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching restaurants:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les restaurants",
          variant: "destructive",
        });
        throw error;
      }

      let filteredData = data as Restaurant[];
      
      // Filter by price range
      if (priceRange !== 'all') {
        filteredData = filteredData.filter(restaurant => {
          const avgPrice = restaurant.menu_items?.reduce((acc, item) => acc + item.price, 0) / (restaurant.menu_items?.length || 1);
          switch(priceRange) {
            case 'low': return avgPrice < 5000;
            case 'medium': return avgPrice >= 5000 && avgPrice <= 15000;
            case 'high': return avgPrice > 15000;
            default: return true;
          }
        });
      }

      try {
        // Fetch restaurant images from Unsplash
        const restaurantPhotos = await unsplash.search.getPhotos({
          query: 'restaurant interior food african cuisine',
          perPage: filteredData.length,
          orientation: 'landscape'
        });

        if (restaurantPhotos.errors) {
          console.error('Unsplash API errors:', restaurantPhotos.errors);
          return filteredData;
        }

        // Add images to restaurants
        return filteredData.map((restaurant, index) => ({
          ...restaurant,
          image_url: restaurantPhotos.response?.results[index]?.urls.regular || 
                    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop'
        }));

      } catch (error) {
        console.error('Error fetching restaurant images:', error);
        return filteredData;
      }

      // Sort restaurants
      return filteredData.sort((a, b) => {
        switch(sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'preparation_time':
            return a.estimated_preparation_time - b.estimated_preparation_time;
          default:
            return 0;
        }
      });
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
          <Skeleton 
            key={index}
            className="h-[300px] w-full rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {restaurants?.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={{
            ...restaurant,
            address: restaurant.address.replace('Kinshasa', 'Brazzaville')
          }}
          onClick={handleRestaurantClick}
        />
      ))}
    </div>
  );
};

export default RestaurantGrid;