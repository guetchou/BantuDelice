
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TaxiDriver, TaxiVehicleType } from '@/types/taxi';
import { toast } from 'sonner';

export function useDriverSelection() {
  const [availableDrivers, setAvailableDrivers] = useState<TaxiDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<TaxiDriver | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Recherche des chauffeurs disponibles
  const findAvailableDrivers = async (
    pickupLatitude: number,
    pickupLongitude: number,
    vehicleType: TaxiVehicleType
  ) => {
    try {
      setLoading(true);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dans une application réelle, on rechercherait les chauffeurs à proximité
      // Pour cette démo, nous simulons des chauffeurs
      const simulatedDrivers: TaxiDriver[] = [
        {
          id: 'driver-1',
          user_id: 'user-1',
          name: 'Jean Dupont',
          phone: '+242123456789',
          profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
          vehicle_type: vehicleType,
          vehicle_make: 'Toyota',
          vehicle_model: 'Corolla',
          vehicle_color: 'Blanc',
          license_plate: 'AB-123-CD',
          rating: 4.8,
          total_rides: 532,
          is_available: true,
          current_latitude: pickupLatitude + (Math.random() - 0.5) * 0.01,
          current_longitude: pickupLongitude + (Math.random() - 0.5) * 0.01,
          languages: ['Français', 'Lingala'],
          years_experience: 3
        },
        {
          id: 'driver-2',
          user_id: 'user-2',
          name: 'Marie Leclerc',
          phone: '+242198765432',
          profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
          vehicle_type: vehicleType,
          vehicle_make: 'Hyundai',
          vehicle_model: 'Tucson',
          vehicle_color: 'Gris',
          license_plate: 'EF-456-GH',
          rating: 4.9,
          total_rides: 867,
          is_available: true,
          current_latitude: pickupLatitude + (Math.random() - 0.5) * 0.01,
          current_longitude: pickupLongitude + (Math.random() - 0.5) * 0.01,
          languages: ['Français', 'Anglais'],
          years_experience: 5
        },
        {
          id: 'driver-3',
          user_id: 'user-3',
          name: 'Paul Mbemba',
          phone: '+242176543210',
          profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
          vehicle_type: vehicleType,
          vehicle_make: 'Kia',
          vehicle_model: 'Sportage',
          vehicle_color: 'Noir',
          license_plate: 'IJ-789-KL',
          rating: 4.6,
          total_rides: 341,
          is_available: true,
          current_latitude: pickupLatitude + (Math.random() - 0.5) * 0.01,
          current_longitude: pickupLongitude + (Math.random() - 0.5) * 0.01,
          languages: ['Français', 'Kituba'],
          years_experience: 2
        }
      ];
      
      // Filtre par type de véhicule
      const filteredDrivers = simulatedDrivers.filter(driver => 
        driver.vehicle_type === vehicleType
      );
      
      setAvailableDrivers(filteredDrivers);
      return filteredDrivers;
    } catch (error) {
      console.error('Erreur lors de la recherche de chauffeurs:', error);
      toast.error('Impossible de trouver des chauffeurs disponibles');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Sélection d'un chauffeur
  const handleSelectDriver = (driver: TaxiDriver | null) => {
    setSelectedDriver(driver);
    
    if (driver) {
      toast.success(`Vous avez sélectionné ${driver.name} comme chauffeur`);
    } else {
      toast.info('Sélection de chauffeur annulée');
    }
  };
  
  return {
    availableDrivers,
    selectedDriver,
    loading,
    findAvailableDrivers,
    handleSelectDriver
  };
}
