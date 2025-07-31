
import React, { useEffect, useState } from 'react';
import { DeliveryDriver, DeliveryLocation } from '@/types/delivery';

interface DeliveryDriverMapProps {
  deliveryId: string;
  restaurantId: string;
  height?: string;
}

const DeliveryDriverMap: React.FC<DeliveryDriverMapProps> = ({ deliveryId, restaurantId, height = '400px' }) => {
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement des données
    const loadData = async () => {
      try {
        // Dans une vraie implémentation, charger les données depuis l'API
        // const { data: driverData } = await api.getDeliveryDriver(deliveryId);
        // const { data: locationData } = await api.getDeliveryLocations(deliveryId);
        
        // Simulation pour le moment
        const mockDriver: DeliveryDriver = {
          id: 'driver-1',
          user_id: 'user-1',
          name: 'John Doe',
          phone: '+123456789',
          current_latitude: 48.8584,
          current_longitude: 2.2945,
          is_available: true,
          vehicle_type: 'car',
          status: 'active',
          profile_picture: 'https://example.com/avatar.jpg',
          rating: 4.8
        };
        
        const mockLocations: DeliveryLocation[] = [
          { latitude: 48.8584, longitude: 2.2945, type: 'driver' },
          { latitude: 48.8606, longitude: 2.3376, type: 'restaurant' },
          { latitude: 48.8530, longitude: 2.3499, type: 'customer' }
        ];
        
        setDriver(mockDriver);
        setLocations(mockLocations);
      } catch (error) {
        console.error("Erreur lors du chargement des données de livraison", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [deliveryId, restaurantId]);

  if (loading) {
    return <div style={{ height, width: '100%' }} className="bg-gray-100 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  // Ici, vous intégreriez une carte réelle (Google Maps, Mapbox, Leaflet, etc.)
  return (
    <div style={{ height, width: '100%' }} className="bg-gray-100 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-500">Carte de suivi du livreur</p>
        {driver && (
          <div className="absolute top-4 right-4 bg-white p-2 rounded shadow">
            <p className="font-bold">{driver.name}</p>
            <p className="text-sm">{driver.status} - {driver.vehicle_type}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDriverMap;
