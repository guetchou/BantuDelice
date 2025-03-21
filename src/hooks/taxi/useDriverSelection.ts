
import { useState } from 'react';

export function useDriverSelection() {
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  
  const handleSelectDriver = (driver: any) => {
    setSelectedDriver(driver);
  };
  
  return {
    selectedDriver,
    handleSelectDriver
  };
}
