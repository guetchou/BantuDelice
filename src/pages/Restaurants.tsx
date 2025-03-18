
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurantsData } from '@/hooks/useRestaurantsData';
import { useGeolocation } from '@/hooks/useGeolocation';
import SearchBar from './restaurants/SearchBar';
import FiltersPanel from './restaurants/FiltersPanel';
import RestaurantViewControls from './restaurants/RestaurantViewControls';
import RestaurantContent from './restaurants/RestaurantContent';
import type { RestaurantFilters as Filters, RestaurantViewMode } from '@/types/restaurant';

export default function Restaurants() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
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

  const { userLocation, findNearMe } = useGeolocation();
  const { restaurants, isLoading } = useRestaurantsData(searchQuery, filters);

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurants/${id}`);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleFindNearMe = () => {
    findNearMe();
    setViewMode('map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorez les restaurants</h1>
          <p className="text-gray-300">Découvrez les meilleurs restaurants de votre région</p>
        </div>

        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFindNearMe={handleFindNearMe}
        />

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <FiltersPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onFindNearMe={handleFindNearMe}
          />

          <div className="flex-grow">
            <RestaurantViewControls 
              viewMode={viewMode}
              setViewMode={setViewMode}
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <RestaurantContent 
              viewMode={viewMode}
              restaurants={restaurants}
              isLoading={isLoading}
              userLocation={userLocation}
              onRestaurantClick={handleRestaurantClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
