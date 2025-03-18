
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import { MarkerF as Marker } from '@react-leaflet/core';
import { Card } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Restaurant type from restaurant.d.ts
interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  logo_url?: string;
  cuisine_type: string[] | string;
  average_rating?: number;
  rating?: number;
}

interface RestaurantMapProps {
  restaurants: Restaurant[];
}

// Custom marker icons
const createMarkerIcon = (iconUrl: string) => {
  return L.divIcon({
    html: `<div class="bg-white p-1 rounded-full shadow-md">
             <img src="${iconUrl}" class="w-8 h-8 rounded-full object-cover" />
           </div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};

const defaultIcon = L.divIcon({
  html: `<div class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 14h14.5c0-6-5-10-7-10-1 0-2 .5-2.5 1.5"></path><path d="M7.5 18c1.71 0 3.287-.573 4.5-1.5 1.213.927 2.79 1.5 4.5 1.5"></path><path d="M6.5 13c-.828 0-1.5-.895-1.5-2s.672-2 1.5-2c.828 0 1.5.895 1.5 2s-.672 2-1.5 2z"></path></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// Component to set the view to fit all markers
const ChangeView = ({ restaurants }: { restaurants: Restaurant[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (restaurants.length === 0) return;
    
    // Create bounds for all restaurants
    const bounds = L.latLngBounds(
      restaurants.map(r => [r.latitude, r.longitude])
    );
    
    // Fit the map to the bounds with some padding
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [restaurants, map]);
  
  return null;
};

const RestaurantMap = ({ restaurants }: RestaurantMapProps) => {
  const navigate = useNavigate();
  const [center, setCenter] = useState<[number, number]>([48.856614, 2.3522219]); // Default to Paris
  
  // Use the first restaurant's coordinates as the center if available
  useEffect(() => {
    if (restaurants.length > 0) {
      const firstRestaurant = restaurants[0];
      setCenter([firstRestaurant.latitude, firstRestaurant.longitude]);
    }
  }, [restaurants]);

  return (
    <Card className="overflow-hidden border">
      <MapContainer
        style={{ height: '75vh', width: '100%' }}
        center={[0, 0]}
        zoom={13}
        scrollWheelZoom={false}
        className="z-0"
      >
        <ChangeView restaurants={restaurants} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data &copy; OpenStreetMap contributors"
        />
        
        {restaurants.map(restaurant => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
            icon={restaurant.logo_url ? createMarkerIcon(restaurant.logo_url) : defaultIcon}
            eventHandlers={{
              click: () => navigate(`/restaurants/${restaurant.id}`)
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-medium text-base">{restaurant.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{restaurant.address}</p>
                <div className="flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-xs ${i < (restaurant.average_rating || restaurant.rating || 0) 
                          ? 'text-yellow-500' 
                          : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    className="ml-2 text-xs text-blue-600 hover:underline"
                  >
                    Voir le menu
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};

export default RestaurantMap;
