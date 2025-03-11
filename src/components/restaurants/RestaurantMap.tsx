
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Restaurant } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';

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
        setUserLocation([position.coords.latitude, position.coords.longitude]);
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
        center={userLocation || center}
        zoom={zoom}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
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
