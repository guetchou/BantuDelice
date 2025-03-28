
import { useState } from 'react';
import { TaxiDriver } from '@/types/taxi';
import { toast } from 'sonner';

export function useDriverSelection() {
  const [selectedDriver, setSelectedDriver] = useState<TaxiDriver | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectDriver = (driver: TaxiDriver) => {
    if (selectedDriver && selectedDriver.id === driver.id) {
      // Désélectionner le chauffeur si déjà sélectionné
      setSelectedDriver(null);
      toast.info("Chauffeur désélectionné");
    } else {
      // Sélectionner un nouveau chauffeur
      setSelectedDriver(driver);
      toast.success(`Chauffeur sélectionné: ${driver.name}`, {
        description: `Évaluation: ${driver.rating} ★`
      });
    }
  };

  const findNearbyDrivers = async (location: {lat: number, lng: number}, vehicleType: string) => {
    setIsLoading(true);
    
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer des chauffeurs fictifs
      const mockDrivers: TaxiDriver[] = [
        {
          id: '1',
          user_id: 'user-123',
          name: 'Jean Dupont',
          phone: '+242 06 123 4567',
          email: 'jean.dupont@example.com',
          profile_image: 'https://randomuser.me/api/portraits/men/32.jpg',
          vehicle_type: 'standard',
          vehicle_make: 'Toyota',
          vehicle_model: 'Corolla',
          vehicle_color: 'Blanc',
          vehicle_year: 2019,
          license_plate: 'BZV 1234',
          rating: 4.8,
          total_rides: 342,
          is_available: true,
          current_location: {
            latitude: location.lat + 0.01,
            longitude: location.lng - 0.01,
            name: 'Près de Poto-Poto'
          }
        },
        {
          id: '2',
          user_id: 'user-456',
          name: 'Marie Okemba',
          phone: '+242 05 234 5678',
          email: 'marie.o@example.com',
          profile_image: 'https://randomuser.me/api/portraits/women/44.jpg',
          vehicle_type: 'comfort',
          vehicle_make: 'Hyundai',
          vehicle_model: 'Accent',
          vehicle_color: 'Gris',
          vehicle_year: 2020,
          license_plate: 'BZV 5678',
          rating: 4.6,
          total_rides: 187,
          is_available: true,
          current_location: {
            latitude: location.lat - 0.005,
            longitude: location.lng + 0.007,
            name: 'Près de Bacongo'
          }
        },
        {
          id: '3',
          user_id: 'user-789',
          name: 'Pascal Nguesso',
          phone: '+242 06 345 6789',
          email: 'pascal.n@example.com',
          profile_image: 'https://randomuser.me/api/portraits/men/67.jpg',
          vehicle_type: 'premium',
          vehicle_make: 'Mercedes',
          vehicle_model: 'Classe E',
          vehicle_color: 'Noir',
          vehicle_year: 2021,
          license_plate: 'BZV 9012',
          rating: 4.9,
          total_rides: 429,
          is_available: true,
          current_location: {
            latitude: location.lat + 0.008,
            longitude: location.lng + 0.003,
            name: 'Près du Boulevard Denis Sassou Nguesso'
          }
        }
      ];
      
      // Filtrer selon le type de véhicule si spécifié
      const filteredDrivers = vehicleType 
        ? mockDrivers.filter(driver => driver.vehicle_type === vehicleType)
        : mockDrivers;
      
      return filteredDrivers;
    } catch (error) {
      console.error('Erreur lors de la recherche de chauffeurs:', error);
      toast.error("Erreur lors de la recherche de chauffeurs disponibles");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedDriver,
    isLoading,
    handleSelectDriver,
    findNearbyDrivers
  };
}
