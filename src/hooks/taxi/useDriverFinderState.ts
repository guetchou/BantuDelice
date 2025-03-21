
import { useState } from 'react';
import { TaxiDriver } from '@/types/taxi';

/**
 * Hook to manage driver finder state
 */
export function useDriverFinderState() {
  const [nearbyDrivers, setNearbyDrivers] = useState<TaxiDriver[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5); // km
  
  const startDriverSearch = () => {
    setIsSearching(true);
  };
  
  const stopDriverSearch = () => {
    setIsSearching(false);
  };
  
  const updateSearchRadius = (radius: number) => {
    setSearchRadius(radius);
  };
  
  return {
    nearbyDrivers,
    setNearbyDrivers,
    isSearching,
    searchRadius,
    startDriverSearch,
    stopDriverSearch,
    updateSearchRadius
  };
}
