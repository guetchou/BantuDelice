
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver, DeliveryRequest } from '@/types/delivery';
import { useToast } from '@/hooks/use-toast';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Bike, Car, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Composant pour mettre à jour la vue de la carte quand les coords changent
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface DeliveryDriverMapProps {
  restaurantId: string;
  deliveryId?: string;
  height?: string;
}

export default function DeliveryDriverMap({ 
  restaurantId, 
  deliveryId,
  height = '100%'
}: DeliveryDriverMapProps) {
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [restaurantCoords, setRestaurantCoords] = useState<[number, number]>([-4.2634, 15.2429]); // Brazzaville default
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantCoords();
      fetchActiveDrivers();
      fetchDeliveries();
      
      // Mise à jour en temps réel des positions des livreurs
      const driversChannel = supabase
        .channel('realtime-drivers')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_drivers',
          filter: `restaurant_id=eq.${restaurantId}`
        }, () => {
          fetchActiveDrivers();
        })
        .subscribe();

      // Mise à jour en temps réel des livraisons
      const deliveriesChannel = supabase
        .channel('realtime-deliveries')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'delivery_requests',
          filter: `restaurant_id=eq.${restaurantId}`
        }, () => {
          fetchDeliveries();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(driversChannel);
        supabase.removeChannel(deliveriesChannel);
      };
    }
  }, [restaurantId, deliveryId]);

  const fetchRestaurantCoords = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('latitude, longitude')
        .eq('id', restaurantId)
        .single();

      if (error) throw error;
      
      if (data) {
        setRestaurantCoords([data.latitude, data.longitude]);
      }
    } catch (error) {
      console.error('Error fetching restaurant coordinates:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les coordonnées du restaurant',
        variant: 'destructive',
      });
    }
  };

  const fetchActiveDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .in('status', ['available', 'busy']);

      if (error) throw error;
      
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les livreurs actifs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveries = async () => {
    try {
      let query = supabase
        .from('delivery_requests')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .in('status', ['assigned', 'picked_up', 'delivering']);

      if (deliveryId) {
        query = query.eq('id', deliveryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les livraisons',
        variant: 'destructive',
      });
    }
  };

  // Créer une icône personnalisée pour les livreurs
  const createDriverIcon = (vehicleType: string) => {
    const html = vehicleType === 'bike' 
      ? '<div class="driver-marker bike"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M19 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M5 14h14"/></svg></div>'
      : vehicleType === 'car'
      ? '<div class="driver-marker car"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg></div>'
      : '<div class="driver-marker"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg></div>';

    return divIcon({
      html,
      className: 'driver-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  };

  // Créer une icône pour les restaurants
  const restaurantIcon = divIcon({
    html: '<div class="restaurant-marker"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 15v5"/><path d="M12 15v5"/><path d="M8 15v5"/><path d="M3 11h18"/><path d="M12 4v7"/><path d="M19 4v15"/><path d="M5 4v15"/></svg></div>',
    className: 'restaurant-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  // Créer une icône pour les clients
  const customerIcon = divIcon({
    html: '<div class="customer-marker"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
    className: 'customer-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  // Style CSS pour les icônes (à ajouter dans votre CSS global)
  const mapStyles = `
    .driver-marker {
      background-color: #10b981;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 0 0 2px white, 0 0 10px rgba(0, 0, 0, 0.3);
    }
    .driver-marker.bike {
      background-color: #10b981;
    }
    .driver-marker.car {
      background-color: #6366f1;
    }
    .restaurant-marker {
      background-color: #e11d48;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 0 0 2px white, 0 0 10px rgba(0, 0, 0, 0.3);
    }
    .customer-marker {
      background-color: #2563eb;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 0 0 2px white, 0 0 10px rgba(0, 0, 0, 0.3);
    }
  `;

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <style>{mapStyles}</style>
      <MapContainer
        center={restaurantCoords}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <MapUpdater center={restaurantCoords} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker pour le restaurant */}
        <Marker position={restaurantCoords} icon={restaurantIcon}>
          <Popup>
            <div className="text-sm font-medium">Restaurant</div>
          </Popup>
        </Marker>

        {/* Markers pour les livreurs */}
        {drivers.map(driver => {
          // Vérifier si le livreur a des coordonnées
          if (!driver.current_latitude || !driver.current_longitude) return null;
          
          return (
            <Marker
              key={driver.id}
              position={[driver.current_latitude, driver.current_longitude]}
              icon={createDriverIcon(driver.vehicle_type || 'bike')}
            >
              <Popup>
                <div className="text-sm font-medium">{driver.name}</div>
                <div className="text-xs text-gray-500">
                  {driver.status === 'available' ? 'Disponible' : 'En livraison'}
                </div>
                {driver.status === 'busy' && (
                  <div className="text-xs mt-1">
                    <span className="font-medium">En mission</span>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}

        {/* Markers pour les clients (adresses de livraison) */}
        {deliveries.map(delivery => {
          if (!delivery.delivery_latitude || !delivery.delivery_longitude) return null;
          
          return (
            <Marker
              key={delivery.id}
              position={[delivery.delivery_latitude, delivery.delivery_longitude]}
              icon={customerIcon}
            >
              <Popup>
                <div className="text-sm font-medium">Livraison #{delivery.id.substring(0, 8)}</div>
                <div className="text-xs text-gray-500">{delivery.delivery_address}</div>
                <div className="text-xs mt-1">
                  <span className="font-medium">Statut:</span>{' '}
                  {delivery.status === 'assigned' ? 'Assignée' :
                   delivery.status === 'picked_up' ? 'Récupérée' :
                   delivery.status === 'delivering' ? 'En livraison' : delivery.status}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
