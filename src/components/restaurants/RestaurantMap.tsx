
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from '@/components/ui/leaflet-map';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { ExternalLink, Phone, Clock, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '@/types/restaurant';

// Define custom marker icons
const createMarkerIcon = (color: string) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  restaurant: createMarkerIcon('blue'),
  user: createMarkerIcon('red'),
  open: createMarkerIcon('green'),
  closed: createMarkerIcon('gray'),
  busy: createMarkerIcon('orange')
};

interface RestaurantMapProps {
  restaurants: Restaurant[];
  userLocation: [number, number] | null;
  onMarkerClick: (id: string) => void;
  isLoading: boolean;
}

const getStatusIcon = (status: string) => {
  if (status === 'open') return icons.open;
  if (status === 'busy') return icons.busy;
  return icons.closed;
};

const RestaurantMap = ({ 
  restaurants, 
  userLocation, 
  onMarkerClick,
  isLoading 
}: RestaurantMapProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([4.0383, 9.7084]); // Default center (Douala)
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(14);
    } else if (restaurants.length > 0) {
      // Center map on first restaurant if no user location
      setMapCenter([restaurants[0].latitude, restaurants[0].longitude]);
    }
  }, [userLocation, restaurants]);

  if (isLoading) {
    return (
      <div className="h-[600px] w-full">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-xl">
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User position marker */}
        {userLocation && (
          <Marker position={userLocation} icon={icons.user}>
            <Popup>
              <div className="text-center p-1">
                <div className="font-bold">Votre position</div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Restaurant markers */}
        {restaurants.map(restaurant => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
            icon={getStatusIcon(restaurant.status)}
          >
            <Popup>
              <div className="w-[220px]">
                {restaurant.banner_image_url && (
                  <div className="h-24 w-full mb-2 overflow-hidden rounded">
                    <img 
                      src={restaurant.banner_image_url} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                
                <div className="flex items-center text-sm mb-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{restaurant.rating} ({restaurant.total_ratings})</span>
                </div>
                
                <div className="text-sm mb-1">
                  <span className="text-gray-700">Cuisine: </span>
                  <span>{typeof restaurant.cuisine_type === 'string' ? restaurant.cuisine_type : restaurant.cuisine_type?.join(', ')}</span>
                </div>
                
                <div className="flex items-center text-sm mb-1">
                  <Clock className="h-3 w-3 mr-1 text-gray-500" />
                  <span className={restaurant.is_open ? "text-green-600" : "text-red-600"}>
                    {restaurant.is_open ? "Ouvert" : "Fermé"}
                  </span>
                </div>
                
                <div className="mt-3 flex flex-col gap-2">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkerClick(restaurant.id);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 w-full"
                    size="sm"
                  >
                    Voir le menu
                  </Button>
                  
                  <div className="flex gap-2">
                    {restaurant.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${restaurant.phone}`);
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {restaurant.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(restaurant.website, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;
