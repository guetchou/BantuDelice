import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  Search, 
  Home, 
  Building, 
  Star,
  Clock,
  Loader2
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationService, LocationData } from '@/services/geolocationService';

interface LocationMapProps {
  onLocationSelect?: (location: LocationData) => void;
  onAddressChange?: (address: string) => void;
  initialAddress?: string;
  showSavedLocations?: boolean;
  className?: string;
}

export default function LocationMap({
  onLocationSelect,
  onAddressChange,
  initialAddress = '',
  showSavedLocations = true,
  className = ''
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const searchBox = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [savedLocations, setSavedLocations] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const {
    coordinates: userCoordinates,
    loading: locationLoading,
    getCurrentPosition,
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

    // Charger les localisations sauvegardées
    if (showSavedLocations) {
      loadSavedLocations();
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
      
      // Ajouter un marqueur pour la position utilisateur
      if (marker.current) {
        marker.current.remove();
      }

      marker.current = new (window as any).mapboxgl.Marker({
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

  // Gérer les clics sur la carte
  const handleMapClick = async (e: any) => {
    const { lng, lat } = e.lngLat;
    
    try {
      const result = await GeolocationService.reverseGeocode([lng, lat]);
      
      if (result) {
        const location: LocationData = {
          name: 'Position sélectionnée',
          address: result.formatted_address,
          coordinates: [lng, lat],
          type: 'recent'
        };

        setSelectedLocation(location);
        setSearchQuery(result.formatted_address);
        onLocationSelect?.(location);
        onAddressChange?.(result.formatted_address);

        // Ajouter un marqueur pour la position sélectionnée
        addLocationMarker([lng, lat], 'selected');
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      toast.error('Erreur lors de la récupération de l\'adresse');
    }
  };

  // Ajouter un marqueur de localisation
  const addLocationMarker = (coordinates: [number, number], type: 'selected' | 'saved' = 'selected') => {
    const [lng, lat] = coordinates;
    
    // Supprimer l'ancien marqueur de sélection
    const existingMarker = document.querySelector('.selected-marker');
    if (existingMarker) {
      existingMarker.remove();
    }

    const markerElement = document.createElement('div');
    markerElement.className = `location-marker ${type}-marker`;
    markerElement.innerHTML = `
      <div class="w-8 h-8 ${type === 'selected' ? 'bg-green-500' : 'bg-orange-500'} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <MapPin class="w-4 h-4 text-white" />
      </div>
    `;

    new (window as any).mapboxgl.Marker({
      element: markerElement
    })
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  // Charger les localisations sauvegardées
  const loadSavedLocations = async () => {
    try {
      // Ici vous devriez récupérer les localisations de l'utilisateur connecté
      // Pour l'instant, on utilise des données de test
      const locations: LocationData[] = [
        {
          id: '1',
          name: 'Domicile',
          address: '123 Avenue de la Paix, Brazzaville',
          coordinates: [15.2429, -4.2634],
          type: 'home'
        },
        {
          id: '2',
          name: 'Bureau',
          address: '456 Boulevard du Commerce, Brazzaville',
          coordinates: [15.2529, -4.2734],
          type: 'work'
        }
      ];

      setSavedLocations(locations);
    } catch (error) {
      console.error('Error loading saved locations:', error);
    }
  };

  // Rechercher une adresse
  const searchAddress = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const result = await GeolocationService.geocodeAddress(searchQuery);
      
      if (result) {
        const [lng, lat] = result.coordinates;
        
        // Centrer la carte sur le résultat
        map.current.flyTo({
          center: [lng, lat],
          zoom: 15
        });

        // Ajouter un marqueur
        addLocationMarker([lng, lat]);

        const location: LocationData = {
          name: 'Adresse recherchée',
          address: result.formatted_address,
          coordinates: [lng, lat],
          type: 'recent'
        };

        setSelectedLocation(location);
        onLocationSelect?.(location);
        onAddressChange?.(result.formatted_address);
      } else {
        toast.error('Adresse non trouvée');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  // Utiliser la position actuelle
  const useCurrentLocation = async () => {
    try {
      const coordinates = await requestPosition();
      
      if (coordinates) {
        const result = await GeolocationService.reverseGeocode(coordinates);
        
        if (result) {
          const location: LocationData = {
            name: 'Position actuelle',
            address: result.formatted_address,
            coordinates: coordinates,
            type: 'recent'
          };

          setSelectedLocation(location);
          setSearchQuery(result.formatted_address);
          onLocationSelect?.(location);
          onAddressChange?.(result.formatted_address);
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast.error('Erreur lors de la récupération de la position actuelle');
    }
  };

  // Sélectionner une localisation sauvegardée
  const selectSavedLocation = (location: LocationData) => {
    const [lng, lat] = location.coordinates;
    
    // Centrer la carte
    map.current.flyTo({
      center: [lng, lat],
      zoom: 15
    });

    // Ajouter un marqueur
    addLocationMarker([lng, lat], 'saved');

    setSelectedLocation(location);
    setSearchQuery(location.address);
    onLocationSelect?.(location);
    onAddressChange?.(location.address);
  };

  // Sauvegarder la localisation actuelle
  const saveCurrentLocation = async () => {
    if (!selectedLocation) {
      toast.error('Aucune localisation sélectionnée');
      return;
    }

    try {
      const savedLocation = await GeolocationService.saveLocation({
        ...selectedLocation,
        user_id: 'current-user-id' // À remplacer par l'ID de l'utilisateur connecté
      });

      setSavedLocations(prev => [savedLocation, ...prev]);
      toast.success('Localisation sauvegardée');
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={searchBox}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une adresse..."
              className="pl-10 pr-4"
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            />
          </div>
          <Button
            onClick={searchAddress}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={useCurrentLocation}
            disabled={locationLoading}
            variant="outline"
            className="px-4"
          >
            {locationLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Carte */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div 
            ref={mapContainer}
            className="w-full h-96 relative"
          />
        </CardContent>
      </Card>

      {/* Localisations sauvegardées */}
      {showSavedLocations && savedLocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Localisations sauvegardées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => selectSavedLocation(location)}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex-shrink-0">
                    {location.type === 'home' && <Home className="w-5 h-5 text-blue-500" />}
                    {location.type === 'work' && <Building className="w-5 h-5 text-green-500" />}
                    {location.type === 'favorite' && <Star className="w-5 h-5 text-yellow-500" />}
                    {location.type === 'recent' && <Clock className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{location.name}</p>
                    <p className="text-sm text-gray-500 truncate">{location.address}</p>
                  </div>
                  {userCoordinates && (
                    <div className="text-xs text-gray-400">
                      {formatDistance(getDistanceTo?.(location.coordinates[1], location.coordinates[0]) || 0)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Localisation sélectionnée */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Localisation sélectionnée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">{selectedLocation.name}</p>
                <p className="text-sm text-gray-500">{selectedLocation.address}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={saveCurrentLocation}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Sauvegarder
                </Button>
                <Button
                  onClick={() => {
                    setSelectedLocation(null);
                    setSearchQuery('');
                    onLocationSelect?.(selectedLocation);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Effacer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 