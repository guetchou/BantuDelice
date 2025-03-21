
import { useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useDeliveryMapData } from '@/hooks/delivery/useDeliveryMapData';
import { DriverMarker, CustomerMarker, RestaurantMarker } from './map/MapMarkers';
import MapUpdater from './map/MapUpdater';
import 'leaflet/dist/leaflet.css';
import './map/MapStyles.css';

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
  const mapRef = useRef<L.Map | null>(null);
  const { drivers, deliveries, restaurantCoords, loading } = useDeliveryMapData(restaurantId, deliveryId);

  if (loading) {
    return (
      <div style={{ height, width: '100%' }} className="bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
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
        <RestaurantMarker position={restaurantCoords} />

        {/* Markers pour les livreurs */}
        {drivers.map(driver => (
          <DriverMarker key={driver.id} driver={driver} />
        ))}

        {/* Markers pour les clients (adresses de livraison) */}
        {deliveries.map(delivery => (
          <CustomerMarker key={delivery.id} delivery={delivery} />
        ))}
      </MapContainer>
    </div>
  );
}
