
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  Search, 
  Clock,
  Star,
  Users,
  Loader2
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationService } from '@/services/geolocationService';

interface TaxiMapProps {
  onPickupSelect?: (coordinates: [number, number], address: string) => void;
  onDestinationSelect?: (coordinates: [number, number], address: string) => void;
  isSelectingPickup?: boolean;
  isSelectingDestination?: boolean;
  showCurrentLocation?: boolean;
}

const TaxiMap: React.FC<TaxiMapProps> = ({
  onPickupSelect,
  onDestinationSelect,
  isSelectingPickup = false,
  isSelectingDestination = false,
  showCurrentLocation = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const pickupMarker = useRef<any>(null);
  const destinationMarker = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const routeLine = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<[number, number] | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  const {
    coordinates: userCoordinates,
    loading: locationLoading,
    requestPosition,
    formatDistance,
    getDistanceTo
  } = useGeolocation();

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Coordonnées par défaut (Brazzaville)
    const defaultCoordinates: [number, number] = [15.2429, -4.2634];

    map.current = new (window as any).mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCoordinates,
      zoom: 13
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(new (window as any).mapboxgl.NavigationControl(), 'top-right');

    // Gérer les clics sur la carte
    map.current.on('click', handleMapClick);

    // Charger les chauffeurs à proximité
    if (userCoordinates) {
      loadNearbyDrivers();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Mettre à jour la carte quand les coordonnées utilisateur changent
  useEffect(() => {
    if (userCoordinates && map.current) {
      const [lng, lat] = userCoordinates;
      setUserLocation([lng, lat]);
      
      // Ajouter un marqueur pour la position utilisateur
      if (userMarker.current) {
        userMarker.current.remove();
      }

      userMarker.current = new (window as any).mapboxgl.Marker({
        color: '#3B82F6',
        element: createUserMarkerElement()
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Centrer la carte sur la position utilisateur
      map.current.flyTo({
        center: [lng, lat],
        zoom: 15
      });

      // Charger les chauffeurs à proximité
      loadNearbyDrivers();
    }
  }, [userCoordinates]);

  // Créer un élément personnalisé pour le marqueur utilisateur
  const createUserMarkerElement = () => {
    const el = document.createElement('div');
    el.className = 'user-marker';
    el.innerHTML = `
      <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
    `;
    return el;
  };

  // Créer un élément pour le marqueur de chauffeur
  const createDriverMarkerElement = (driver: any) => {
    const el = document.createElement('div');
    el.className = 'driver-marker';
    el.innerHTML = `
      <div class="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer" title="${driver.name} - ${driver.vehicle}">
        <span class="text-white text-xs font-bold">🚗</span>
      </div>
    `;
    return el;
  };

  // Gérer les clics sur la carte
  const handleMapClick = async (e: any) => {
    const { lng, lat } = e.lngLat;
    
    try {
      const result = await GeolocationService.reverseGeocode([lng, lat]);
      
      if (result) {
        if (isSelectingPickup) {
          setPickupLocation([lng, lat]);
          addPickupMarker([lng, lat]);
          onPickupSelect?.([lng, lat], result.formatted_address);
        } else if (isSelectingDestination) {
          setDestinationLocation([lng, lat]);
          addDestinationMarker([lng, lat]);
          onDestinationSelect?.([lng, lat], result.formatted_address);
        }
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      toast.error('Erreur lors de la récupération de l\'adresse');
    }
  };

  // Ajouter un marqueur de point de départ
  const addPickupMarker = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates;
    
    if (pickupMarker.current) {
      pickupMarker.current.remove();
    }

    const markerElement = document.createElement('div');
    markerElement.className = 'pickup-marker';
    markerElement.innerHTML = `
      <div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <MapPin class="w-4 h-4 text-white" />
      </div>
    `;

    pickupMarker.current = new (window as any).mapboxgl.Marker({
      element: markerElement
    })
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  // Ajouter un marqueur de destination
  const addDestinationMarker = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates;
    
    if (destinationMarker.current) {
      destinationMarker.current.remove();
    }

    const markerElement = document.createElement('div');
    markerElement.className = 'destination-marker';
    markerElement.innerHTML = `
      <div class="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <Navigation class="w-4 h-4 text-white" />
      </div>
    `;

    destinationMarker.current = new (window as any).mapboxgl.Marker({
      element: markerElement
    })
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  // Charger les chauffeurs à proximité
  const loadNearbyDrivers = async () => {
    if (!userCoordinates) return;

    try {
      const [lng, lat] = userCoordinates;
      
      // Appel à l'API Edge Function
      const response = await fetch(`/functions/v1/taxi-geolocation/nearby-drivers?lat=${lat}&lng=${lng}&radius=2`);
      const data = await response.json();
      
      setNearbyDrivers(data.drivers);

      // Ajouter les marqueurs des chauffeurs
      data.drivers.forEach((driver: any) => {
        const [driverLng, driverLat] = driver.coordinates;
        
        const markerElement = createDriverMarkerElement(driver);
        
        new (window as any).mapboxgl.Marker({
          element: markerElement
        })
          .setLngLat([driverLng, driverLat])
          .addTo(map.current);
      });
    } catch (error) {
      console.error('Error loading nearby drivers:', error);
    }
  };

  // Calculer l'itinéraire
  const calculateRoute = async () => {
    if (!pickupLocation || !destinationLocation) return;

    try {
      const [pickupLng, pickupLat] = pickupLocation;
      const [destLng, destLat] = destinationLocation;
      
      const response = await fetch(`/functions/v1/taxi-geolocation/route?fromLat=${pickupLat}&fromLng=${pickupLng}&toLat=${destLat}&toLng=${destLng}`);
      const data = await response.json();
      
      setRouteInfo(data);

      // Afficher l'itinéraire sur la carte
      if (routeLine.current) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      map.current.addSource('route', {
        type: 'geojson',
        data: data.route
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3B82F6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      routeLine.current = true;
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Erreur lors du calcul de l\'itinéraire');
    }
  };

  // Utiliser la position actuelle comme point de départ
  const useCurrentLocationAsPickup = async () => {
    try {
      const coordinates = await requestPosition();
      if (coordinates) {
        const result = await GeolocationService.reverseGeocode(coordinates);
        if (result) {
          setPickupLocation(coordinates);
          addPickupMarker(coordinates);
          onPickupSelect?.(coordinates, result.formatted_address);
          toast.success('Position actuelle définie comme point de départ');
        }
      }
    } catch (error) {
      console.error('Error using current location:', error);
      toast.error('Erreur lors de la récupération de la position');
    }
  };

  // Sélectionner un chauffeur
  const selectDriver = (driver: any) => {
    setSelectedDriver(driver);
    toast.success(`Chauffeur sélectionné: ${driver.name}`);
  };

  return (
    <div className="space-y-4">
      {/* Contrôles */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={useCurrentLocationAsPickup}
          disabled={locationLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {locationLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Crosshair className="w-4 h-4" />
          )}
          Utiliser ma position
        </Button>
        
        {(pickupLocation && destinationLocation) && (
          <Button
            onClick={calculateRoute}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Calculer l'itinéraire
          </Button>
        )}
      </div>

      {/* Carte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Carte des taxis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapContainer}
            className="w-full h-96 rounded-lg overflow-hidden"
          />
        </CardContent>
      </Card>

      {/* Informations de route */}
      {routeInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Informations de trajet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-500">{routeInfo.distance} km</p>
                <p className="text-sm text-gray-600">Distance</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{routeInfo.duration} min</p>
                <p className="text-sm text-gray-600">Durée estimée</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{routeInfo.fare} FCFA</p>
                <p className="text-sm text-gray-600">Prix estimé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chauffeurs à proximité */}
      {nearbyDrivers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Chauffeurs à proximité ({nearbyDrivers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearbyDrivers.map((driver) => (
                <div
                  key={driver.id}
                  onClick={() => selectDriver(driver)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    selectedDriver?.id === driver.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🚗</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <p className="text-sm text-gray-500">{driver.vehicle} • {driver.plate}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(driver.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{driver.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{formatDistance(driver.distance)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant={driver.available ? "default" : "secondary"}>
                      {driver.available ? 'Disponible' : 'Occupé'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxiMap;
