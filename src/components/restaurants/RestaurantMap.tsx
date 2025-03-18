
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Restaurant } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to update map view when center prop changes
function MapViewUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onRestaurantClick: (id: string) => void;
  center?: [number, number];
  zoom?: number;
}

export default function RestaurantMap({ 
  restaurants, 
  onRestaurantClick,
  center = [-4.2634, 15.2429], // Default to Brazzaville
  zoom = 13 
}: RestaurantMapProps) {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Erreur",
        description: "La géolocalisation n'est pas supportée par votre navigateur",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: [number, number] = [
          position.coords.latitude,
          position.coords.longitude
        ];
        setUserLocation(newLocation);
        setMapCenter(newLocation);
      },
      () => {
        toast({
          title: "Erreur",
          description: "Impossible d'obtenir votre position",
          variant: "destructive"
        });
      }
    );
  };

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden">
      <Button
        onClick={handleLocationClick}
        className="absolute top-4 right-4 z-[400] bg-white text-black hover:bg-gray-100"
      >
        <MapPin className="mr-2 h-4 w-4" />
        Ma position
      </Button>

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
      >
        <MapViewUpdater center={userLocation || mapCenter} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{restaurant.name}</h3>
                <p className="text-sm text-gray-600">{restaurant.cuisine_type}</p>
                <Button
                  onClick={() => onRestaurantClick(restaurant.id)}
                  variant="link"
                  className="mt-2 p-0"
                >
                  Voir le menu
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Votre position</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
