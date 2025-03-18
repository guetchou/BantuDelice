
import { useState } from 'react';
import { TaxiDriver } from '@/types/taxi';
import { useDriverFinder } from './taxi/useDriverFinder';
import { useDriverDetails } from './taxi/useDriverDetails';
import { useDriverRequests } from './taxi/useDriverRequests';

/**
 * Combines driver selection hooks into a single interface
 */
export function useTaxiDriverSelection() {
  const [nearbyDrivers, setNearbyDrivers] = useState<TaxiDriver[]>([]);
  
  const { isLoading: isDriverFinderLoading, findOptimalDrivers } = useDriverFinder();
  const { isLoading: isDriverDetailsLoading, getDriverDetails } = useDriverDetails();
  const { isLoading: isDriverRequestLoading, requestDriver } = useDriverRequests();

  // Combined loading state
  const isLoading = isDriverFinderLoading || isDriverDetailsLoading || isDriverRequestLoading;

  // Handle updating nearby drivers state when finding drivers
  const findDrivers = async (
    pickupLatitude: number,
    pickupLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number,
    vehicleType?: string
  ) => {
    const drivers = await findOptimalDrivers(
      pickupLatitude,
      pickupLongitude,
      destinationLatitude,
      destinationLongitude,
      vehicleType
    );
    setNearbyDrivers(drivers);
    return drivers;
  };

  return {
    isLoading,
    nearbyDrivers,
    findOptimalDrivers: findDrivers,
    getDriverDetails,
    requestDriver
  };
}
