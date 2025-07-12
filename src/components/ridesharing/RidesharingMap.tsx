
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
  Loader2,
  Car,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationService } from '@/services/geolocationService';
import { EdgeFunctionsService } from '@/services/edgeFunctions';

interface RidesharingMapProps {
  onPickupSelect?: (coordinates: [number, number], address: string) => void;
  onDestinationSelect?: (coordinates: [number, number], address: string) => void;
  isSelectingPickup?: boolean;
  isSelectingDestination?: boolean;
  showCurrentLocation?: boolean;
}

const RidesharingMap: React.FC<RidesharingMapProps> = ({
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
  const rideMarkers = useRef<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<[number, number] | null>(null);
  const [nearbyRides, setNearbyRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [bookingRide, setBookingRide] = useState(false);

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

    // Charger les trajets à proximité
    if (userCoordinates) {
      loadNearbyRides();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Obtenir la position actuelle de l'utilisateur
  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const result = await GeolocationService.getCurrentLocation();
      if (result) {
        const [lng, lat] = result.coordinates;
        setUserLocation([lng, lat]);
        
        // Centrer la carte sur la position de l'utilisateur
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 15
          });
        }

        // Ajouter le marqueur utilisateur
        if (userMarker.current) {
          userMarker.current.remove();
        }
        
        userMarker.current = new (window as any).mapboxgl.Marker({
          color: '#3B82F6',
          element: createUserMarkerElement()
        })
        .setLngLat([lng, lat])
        .addTo(map.current);

        // Charger les trajets à proximité
        await loadNearbyRides();
        
        toast.success('Position actuelle récupérée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      toast.error('Erreur lors de la récupération de la position');
    } finally {
      setIsLoading(false);
    }
  };

  // Créer l'élément du marqueur utilisateur
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

  // Charger les trajets à proximité
  const loadNearbyRides = async () => {
    if (!userCoordinates) return;

    try {
      const [lng, lat] = userCoordinates;
      const rides = await EdgeFunctionsService.getNearbyRides(lat, lng, 5);
      setNearbyRides(rides);

      // Ajouter les marqueurs des trajets
      addRideMarkers(rides);
    } catch (error) {
      console.error('Erreur lors du chargement des trajets:', error);
      toast.error('Erreur lors du chargement des trajets');
    }
  };

  // Ajouter les marqueurs des trajets
  const addRideMarkers = (rides: any[]) => {
    // Supprimer les anciens marqueurs
    rideMarkers.current.forEach(marker => marker.remove());
    rideMarkers.current = [];

    rides.forEach(ride => {
      const el = document.createElement('div');
      el.className = 'ride-marker';
      el.innerHTML = `
        <div class="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
          <Car className="w-4 h-4 text-white" />
        </div>
      `;

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([ride.pickup_lng, ride.pickup_lat])
        .addTo(map.current);

      // Ajouter un popup avec les informations du trajet
      const popup = new (window as any).mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <div class="font-semibold text-sm">${ride.driver_name}</div>
            <div class="text-xs text-gray-600">${ride.pickup_address}</div>
            <div class="text-xs text-gray-600">→ ${ride.destination_address}</div>
            <div class="text-xs text-green-600 font-semibold">${ride.price} FCFA</div>
            <button class="mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600" onclick="window.selectRide('${ride.id}')">
              Réserver
            </button>
          </div>
        `);

      marker.setPopup(popup);
      rideMarkers.current.push(marker);

      // Ajouter l'événement de clic
      el.addEventListener('click', () => {
        setSelectedRide(ride);
        setShowRideDetails(true);
      });
    });
  };

  // Gérer les clics sur la carte
  const handleMapClick = async (e: any) => {
    const { lng, lat } = e.lngLat;
    
    if (isSelectingPickup) {
      const address = await GeolocationService.reverseGeocode([lat, lng]);
      setPickupLocation([lng, lat]);
      onPickupSelect?.([lng, lat], address);
      
      // Ajouter le marqueur de départ
      if (pickupMarker.current) {
        pickupMarker.current.remove();
      }
      
      pickupMarker.current = new (window as any).mapboxgl.Marker({
        color: '#10B981',
        element: createPickupMarkerElement()
      })
      .setLngLat([lng, lat])
      .addTo(map.current);
      
    } else if (isSelectingDestination) {
      const address = await GeolocationService.reverseGeocode([lat, lng]);
      setDestinationLocation([lng, lat]);
      onDestinationSelect?.([lng, lat], address);
      
      // Ajouter le marqueur de destination
      if (destinationMarker.current) {
        destinationMarker.current.remove();
      }
      
      destinationMarker.current = new (window as any).mapboxgl.Marker({
        color: '#EF4444',
        element: createDestinationMarkerElement()
      })
      .setLngLat([lng, lat])
      .addTo(map.current);
      
      // Calculer l'itinéraire
      if (pickupLocation) {
        calculateRoute(pickupLocation, [lng, lat]);
      }
    }
  };

  // Créer l'élément du marqueur de départ
  const createPickupMarkerElement = () => {
    const el = document.createElement('div');
    el.className = 'pickup-marker';
    el.innerHTML = `
      <div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <MapPin className="w-3 h-3 text-white" />
      </div>
    `;
    return el;
  };

  // Créer l'élément du marqueur de destination
  const createDestinationMarkerElement = () => {
    const el = document.createElement('div');
    el.className = 'destination-marker';
    el.innerHTML = `
      <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <Navigation className="w-3 h-3 text-white" />
      </div>
    `;
    return el;
  };

  // Calculer l'itinéraire
  const calculateRoute = async (from: [number, number], to: [number, number]) => {
    try {
      const [fromLng, fromLat] = from;
      const [toLng, toLat] = to;
      
      const route = await EdgeFunctionsService.calculateTaxiRoute(fromLat, fromLng, toLat, toLng);
      setRouteInfo(route);

      // Afficher l'itinéraire sur la carte
      if (routeLine.current) {
        routeLine.current.remove();
      }

      routeLine.current = new (window as any).mapboxgl.GeoJSONSource({
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates
          }
        }
      });

      map.current.addSource('route', routeLine.current);
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

      // Ajuster la vue pour montrer tout l'itinéraire
      const bounds = new (window as any).mapboxgl.LngLatBounds();
      bounds.extend(from);
      bounds.extend(to);
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });

    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
      toast.error('Erreur lors du calcul de l\'itinéraire');
    }
  };

  // Réserver un trajet
  const bookRide = async (rideId: string) => {
    setBookingRide(true);
    try {
      const bookingData = {
        ride_id: rideId,
        passenger_id: 'user_id', // Remplacer par l'ID réel de l'utilisateur
        pickup_location: pickupLocation,
        destination_location: destinationLocation,
        passenger_count: 1
      };

      const result = await EdgeFunctionsService.joinRide(rideId, bookingData);
      
      toast.success('Trajet réservé avec succès !');
      setShowRideDetails(false);
      setSelectedRide(null);
      
      // Recharger les trajets
      await loadNearbyRides();
      
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      toast.error('Erreur lors de la réservation');
    } finally {
      setBookingRide(false);
    }
  };

  // Créer un nouveau trajet
  const createRide = async (rideData: any) => {
    try {
      const result = await EdgeFunctionsService.createRide(rideData);
      
      toast.success('Trajet créé avec succès !');
      setShowCreateRide(false);
      
      // Recharger les trajets
      await loadNearbyRides();
      
    } catch (error) {
      console.error('Erreur lors de la création du trajet:', error);
      toast.error('Erreur lors de la création du trajet');
    }
  };

  // Rechercher des trajets
  const searchRides = async () => {
    if (!searchQuery.trim()) return;

    try {
      const geocodeResult = await GeolocationService.geocodeAddress(searchQuery);
      if (geocodeResult) {
        const [lng, lat] = geocodeResult.coordinates;
        
        // Centrer la carte sur l'adresse recherchée
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14
        });

        // Charger les trajets à proximité de cette adresse
        const rides = await EdgeFunctionsService.getNearbyRides(lat, lng, 3);
        setNearbyRides(rides);
        addRideMarkers(rides);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche');
    }
  };

  // Mettre à jour la position de l'utilisateur quand elle change
  useEffect(() => {
    if (userCoordinates) {
      const [lng, lat] = userCoordinates;
      setUserLocation([lng, lat]);
      
      if (map.current && !userMarker.current) {
        getCurrentLocation();
      }
    }
  }, [userCoordinates]);

  return (
    <div className="relative h-full w-full">
      {/* Carte */}
      <div ref={mapContainer} className="h-full w-full rounded-lg overflow-hidden" />
      
      {/* Contrôles de la carte */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Button
          onClick={getCurrentLocation}
          variant="secondary"
          size="icon"
          className="bg-white shadow-md hover:bg-gray-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          ) : (
            <Crosshair className="h-5 w-5 text-gray-500" />
          )}
        </Button>
        
        <Button
          onClick={() => setShowCreateRide(true)}
          variant="secondary"
          size="icon"
          className="bg-green-500 text-white shadow-md hover:bg-green-600"
        >
          <Car className="h-5 w-5" />
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center bg-white rounded-lg shadow-md px-3 py-2">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <Input
            placeholder="Rechercher une adresse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus:ring-0 w-64"
            onKeyPress={(e) => e.key === 'Enter' && searchRides()}
          />
          <Button
            onClick={searchRides}
            variant="ghost"
            size="sm"
            className="ml-2"
          >
            Rechercher
          </Button>
        </div>
      </div>

      {/* Informations de l'itinéraire */}
      {routeInfo && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">
                    Distance: {routeInfo.distance} km
                  </div>
                  <div className="text-xs text-gray-600">
                    Durée: {routeInfo.duration} min
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {routeInfo.price} FCFA
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de création de trajet */}
      {showCreateRide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Créer un trajet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Point de départ</label>
                <Input
                  placeholder="Adresse de départ"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Destination</label>
                <Input
                  placeholder="Adresse de destination"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Prix</label>
                <Input
                  type="number"
                  placeholder="Prix en FCFA"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Places disponibles</label>
                <Input
                  type="number"
                  placeholder="Nombre de places"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCreateRide(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => createRide({})}
                  className="flex-1"
                >
                  Créer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de détails du trajet */}
      {showRideDetails && selectedRide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Détails du trajet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">{selectedRide.driver_name}</div>
                  <div className="text-sm text-gray-600">⭐ {selectedRide.rating}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{selectedRide.pickup_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{selectedRide.destination_address}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedRide.available_seats} places</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedRide.departure_time}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {selectedRide.price} FCFA
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowRideDetails(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => bookRide(selectedRide.id)}
                  disabled={bookingRide}
                  className="flex-1"
                >
                  {bookingRide ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Réservation...
                    </>
                  ) : (
                    'Réserver'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions de sélection */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        {isSelectingPickup && (
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-center">
            Touchez la carte pour définir votre point de départ
          </div>
        )}
        {isSelectingDestination && (
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-center">
            Touchez la carte pour définir votre destination
          </div>
        )}
      </div>
    </div>
  );
};

export default RidesharingMap;
