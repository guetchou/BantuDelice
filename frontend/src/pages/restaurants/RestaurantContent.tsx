
import type { Restaurant, RestaurantViewMode } from '@/types/restaurant';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import RestaurantMap from '@/components/restaurants/RestaurantMap';

interface RestaurantContentProps {
  viewMode: RestaurantViewMode;
  restaurants: Restaurant[];
  isLoading: boolean;
  userLocation: [number, number] | null;
  onRestaurantClick: (id: string) => void;
}

export default function RestaurantContent({
  viewMode,
  restaurants,
  isLoading,
  userLocation,
  onRestaurantClick
}: RestaurantContentProps) {
  return (
    <>
      {viewMode === 'map' ? (
        <RestaurantMap 
          restaurants={restaurants}
          userLocation={userLocation}
          onMarkerClick={onRestaurantClick}
          isLoading={isLoading}
        />
      ) : (
        <RestaurantGrid 
          restaurants={restaurants}
          isLoading={isLoading}
          onRestaurantClick={onRestaurantClick}
          columns={viewMode === 'list' ? 1 : 3}
        />
      )}
    </>
  );
}
