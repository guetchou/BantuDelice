
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ViewGrid, Map, Filter } from 'lucide-react';
import SearchBar from '@/components/home/SearchBar';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import RestaurantMap from '@/components/restaurants/RestaurantMap';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import type { Restaurant, RestaurantFilters as Filters, RestaurantViewMode } from '@/types/restaurant';

const sortOptions = [
  { label: 'Popularité', value: 'rating' },
  { label: 'Distance', value: 'distance' },
  { label: 'Prix minimum', value: 'price' },
  { label: 'Temps de préparation', value: 'preparation_time' }
];

export default function Restaurants() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<RestaurantViewMode>({ type: 'grid', gridColumns: 3 });
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState('rating');

  // Fetch restaurants with search and filters
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['restaurants', searchQuery, filters, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('restaurants')
        .select('*');

      // Apply text search
      if (searchQuery) {
        query = query.textSearch('search_vector', searchQuery);
      }

      // Apply filters
      if (filters.cuisine_type?.length) {
        query = query.in('cuisine_type', filters.cuisine_type);
      }
      if (filters.price_range) {
        query = query.eq('price_range', filters.price_range);
      }
      if (filters.rating) {
        query = query.gte('rating', filters.rating);
      }
      if (filters.isOpen) {
        // We'll need a more complex query here to check opening hours
        // This is just a placeholder
        query = query.eq('status', 'open');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching restaurants:', error);
        return [];
      }

      // Convert to Restaurant type and sort
      return (data as Restaurant[]).sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'distance':
            return (a.distance || 0) - (b.distance || 0);
          case 'price':
            return (a.minimum_order || 0) - (b.minimum_order || 0);
          case 'preparation_time':
            return (a.average_prep_time || 0) - (b.average_prep_time || 0);
          default:
            return 0;
        }
      });
    }
  });

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Restaurants à Brazzaville
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Découvrez une sélection unique de restaurants, des saveurs locales aux cuisines internationales
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          <div className="flex gap-2">
            <RestaurantFilters
              filters={filters}
              onChange={setFilters}
            />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex rounded-md shadow-sm">
              <Button
                variant={viewMode.type === 'grid' ? 'default' : 'outline'}
                className="rounded-l-md rounded-r-none"
                onClick={() => setViewMode({ type: 'grid', gridColumns: 3 })}
              >
                <ViewGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode.type === 'map' ? 'default' : 'outline'}
                className="rounded-l-none rounded-r-md"
                onClick={() => setViewMode({ type: 'map' })}
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {viewMode.type === 'grid' ? (
          <RestaurantGrid
            restaurants={restaurants}
            isLoading={isLoading}
            onRestaurantClick={handleRestaurantClick}
            columns={viewMode.gridColumns}
          />
        ) : (
          <RestaurantMap
            restaurants={restaurants}
            onRestaurantClick={handleRestaurantClick}
          />
        )}
      </div>
    </div>
  );
}
