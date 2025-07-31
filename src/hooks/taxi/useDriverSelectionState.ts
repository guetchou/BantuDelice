
import { useState } from 'react';
import { TaxiDriver } from '@/types/taxi';

/**
 * Hook to manage driver selection state
 */
export function useDriverSelectionState() {
  const [selectedDriver, setSelectedDriver] = useState<TaxiDriver | null>(null);
  
  const handleSelectDriver = (driver: TaxiDriver) => {
    setSelectedDriver(driver);
  };
  
  return {
    selectedDriver,
    handleSelectDriver
  };
}
