
import { useRef, useEffect } from 'react';
import L from 'leaflet';
import { useDeliveryMapData } from '@/hooks/delivery/useDeliveryMapData';
import 'leaflet/dist/leaflet.css';
import './map/MapStyles.css';

// Fix for Leaflet icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the icon issue for leaflet
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
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const { drivers, deliveries, restaurantCoords, loading } = useDeliveryMapData(restaurantId, deliveryId);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Create map instance
    leafletMapRef.current = L.map(mapRef.current).setView(restaurantCoords, 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMapRef.current);

    // Add restaurant marker
    createRestaurantMarker(leafletMapRef.current, restaurantCoords);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [restaurantCoords]);

  // Update markers when data changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // Clear existing markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add restaurant marker
    createRestaurantMarker(map, restaurantCoords);

    // Add driver markers
    drivers.forEach(driver => {
      if (!driver.current_latitude || !driver.current_longitude) return;
      
      addDriverMarker(map, driver);
    });

    // Add delivery markers
    deliveries.forEach(delivery => {
      addDeliveryMarker(map, delivery);
    });
  }, [drivers, deliveries, restaurantCoords]);

  // Create restaurant marker
  const createRestaurantMarker = (map: L.Map, position: [number, number]) => {
    const restaurantIcon = L.divIcon({
      html: '<div class="restaurant-marker"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 15v5"/><path d="M12 15v5"/><path d="M8 15v5"/><path d="M3 11h18"/><path d="M12 4v7"/><path d="M19 4v15"/><path d="M5 4v15"/></svg></div>',
      className: 'restaurant-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
    
    L.marker(position, { icon: restaurantIcon }).addTo(map);
  };

  // Add driver marker
  const addDriverMarker = (map: L.Map, driver: any) => {
    const vehicleType = driver.vehicle_type || 'bike';
    const driverIcon = L.divIcon({
      html: `<div class="driver-marker ${vehicleType}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M19 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M5 14h14"/></svg></div>`,
      className: 'driver-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
    
    const marker = L.marker([driver.current_latitude, driver.current_longitude], { icon: driverIcon }).addTo(map);
    
    marker.bindPopup(`
      <div class="text-sm font-medium">${driver.name}</div>
      <div class="text-xs text-gray-500">
        ${driver.status === 'available' ? 'Disponible' : 'En livraison'}
      </div>
    `);
  };

  // Add delivery marker
  const addDeliveryMarker = (map: L.Map, delivery: any) => {
    const lat = delivery.delivery_latitude || delivery.dropoff_latitude;
    const lng = delivery.delivery_longitude || delivery.dropoff_longitude;
    
    if (!lat || !lng) return;
    
    const customerIcon = L.divIcon({
      html: '<div class="customer-marker"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
      className: 'customer-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
    
    const marker = L.marker([lat, lng], { icon: customerIcon }).addTo(map);
    
    const deliveryAddress = delivery.delivery_address || delivery.dropoff_address || '';
    
    marker.bindPopup(`
      <div class="text-sm font-medium">Livraison #${delivery.id.substring(0, 8)}</div>
      <div class="text-xs text-gray-500">${deliveryAddress}</div>
      <div class="text-xs mt-1">
        <span class="font-medium">Statut:</span> ${delivery.status}
      </div>
    `);
  };

  if (loading) {
    return (
      <div style={{ height, width: '100%' }} className="bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
}
