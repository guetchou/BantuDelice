
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTableExistence } from '@/hooks/useTableExistence';
import type { Restaurant, RestaurantFilters } from '@/types/restaurant';

export function useRestaurantsData(searchQuery: string, filters: RestaurantFilters) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
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

  return {
    restaurants: filteredRestaurants,
    isLoading,
    refreshRestaurants: fetchRestaurants
  };
}
