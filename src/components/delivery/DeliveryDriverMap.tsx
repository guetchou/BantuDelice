
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DeliveryDriver, DeliveryRequest } from '@/types/delivery';

// Fix the Leaflet icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create custom icons
const createIcon = (iconUrl: string) => {
  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const driverIcon = createIcon('/assets/driver-marker.png');
const restaurantIcon = createIcon('/assets/restaurant-marker.png');
const customerIcon = createIcon('/assets/customer-marker.png');

interface MapCenterUpdaterProps {
  center: [number, number];
}

// Component to update map center
const MapCenterUpdater: React.FC<MapCenterUpdaterProps> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  
  return null;
};

interface DeliveryDriverMapProps {
  driver?: DeliveryDriver;
  request?: DeliveryRequest;
  center?: [number, number];
  zoom?: number;
}

const DeliveryDriverMap: React.FC<DeliveryDriverMapProps> = ({ 
  driver, 
  request, 
  center = [0, 0],
  zoom = 13 
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  useEffect(() => {
    if (driver) {
      setMapCenter([driver.current_latitude, driver.current_longitude]);
    } else if (request && request.pickup_latitude && request.pickup_longitude) {
      setMapCenter([request.pickup_latitude, request.pickup_longitude]);
    } else {
      setMapCenter(center);
    }
  }, [driver, request, center]);

  return (
    <div className="h-64 w-full rounded-md overflow-hidden shadow-md">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapCenterUpdater center={mapCenter} />
        
        {driver && (
          <Marker 
            position={[driver.current_latitude, driver.current_longitude]}
            icon={driverIcon}
          >
            <Popup>
              <div>
                <strong>{driver.name}</strong>
                <p>{driver.vehicle_type}</p>
                <p>Rating: {driver.rating} ★</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {request && request.pickup_latitude && request.pickup_longitude && (
          <Marker 
            position={[request.pickup_latitude, request.pickup_longitude]}
            icon={restaurantIcon}
          >
            <Popup>
              <div>
                <strong>Pickup Location</strong>
                <p>{request.pickup_address}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {request && request.delivery_latitude && request.delivery_longitude && (
          <Marker 
            position={[request.delivery_latitude, request.delivery_longitude]}
            icon={customerIcon}
          >
            <Popup>
              <div>
                <strong>Delivery Location</strong>
                <p>{request.delivery_address}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default DeliveryDriverMap;
