
import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { DeliveryDriver, DeliveryRequest, DeliveryStatus } from '@/types/delivery';

interface DriverMarkerProps {
  driver: DeliveryDriver;
}

export const DriverMarker = ({ driver }: DriverMarkerProps) => {
  // Vérifier si le livreur a des coordonnées
  if (!driver.current_latitude || !driver.current_longitude) return null;
  
  // Créer une icône personnalisée
  const driverIcon = createDriverIcon(driver.vehicle_type || 'bike');
  
  return (
    <Marker
      key={driver.id}
      position={[driver.current_latitude, driver.current_longitude]}
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
};

interface CustomerMarkerProps {
  delivery: DeliveryRequest;
}

export const CustomerMarker = ({ delivery }: CustomerMarkerProps) => {
  if (!delivery.delivery_latitude || !delivery.delivery_longitude) return null;
  
  return (
    <Marker
      key={delivery.id}
      position={[delivery.delivery_latitude, delivery.delivery_longitude]}
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
};

export const RestaurantMarker = ({ position }: { position: [number, number] }) => {
  return (
    <Marker position={position}>
      <Popup>
        <div className="text-sm font-medium">Restaurant</div>
      </Popup>
    </Marker>
  );
};

// Créer une icône personnalisée pour les livreurs
export const createDriverIcon = (vehicleType: string) => {
  const html = vehicleType === 'bike' 
    ? '<div class="driver-marker bike"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M19 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M5 14h14"/></svg></div>'
    : vehicleType === 'car'
    ? '<div class="driver-marker car"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg></div>'
    : '<div class="driver-marker"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg></div>';

  return L.divIcon({
    html,
    className: 'driver-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

// Créer une icône pour les restaurants
export const restaurantIcon = L.divIcon({
  html: '<div class="restaurant-marker"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 15v5"/><path d="M12 15v5"/><path d="M8 15v5"/><path d="M3 11h18"/><path d="M12 4v7"/><path d="M19 4v15"/><path d="M5 4v15"/></svg></div>',
  className: 'restaurant-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Créer une icône pour les clients
export const customerIcon = L.divIcon({
  html: '<div class="customer-marker"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
  className: 'customer-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
