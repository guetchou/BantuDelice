
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { useToast } from "@/hooks/use-toast";
import { createApi } from 'unsplash-js';

// Initialize the Unsplash client
const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
console.log('Unsplash Access Key in RestaurantGrid:', unsplashAccessKey ? 'Present' : 'Missing');

const unsplash = createApi({
  accessKey: unsplashAccessKey || '',
  // Adding explicit authentication headers
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
  const { toast } = useToast();

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
        if (!unsplashAccessKey) {
          console.error('Unsplash API key is missing');
          return filteredData;
        }

        // Fetch restaurant images from Unsplash with more specific query
        const restaurantPhotos = await unsplash.search.getPhotos({
          query: 'african restaurant food cuisine',
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
        toast({
          title: "Attention",
          description: "Impossible de charger les images des restaurants",
          variant: "destructive",
        });
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {restaurants?.map((restaurant) => (
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
