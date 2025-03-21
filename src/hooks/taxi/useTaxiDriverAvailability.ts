
import { useState } from 'react';
import { TaxiDriver } from '@/types/taxi';

/**
 * Hook to manage nearby drivers availability
 */
export function useTaxiDriverAvailability() {
  const [nearbyDrivers, setNearbyDrivers] = useState<TaxiDriver[]>([]);
  
  return {
    nearbyDrivers,
    setNearbyDrivers
  };
}
