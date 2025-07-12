import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MapPin, Navigation, Crosshair, Search } from 'lucide-react';
import { 
  initializeMapbox, 
  getMapbox, 
  geocodeAddress, 
  reverseGeocode,
  calculateRoute,
  formatDistance,
  formatDuration,
  MAPBOX_CONFIG 
} from '@/utils/mapbox-init';

interface MapboxExampleProps {
  apiKey?: string;
}

const MapboxExample: React.FC<MapboxExampleProps> = ({ apiKey }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  // Initialize Mapbox with custom API key if provided
  useEffect(() => {
    if (apiKey) {
      // Override the access token with the provided API key
      (window as any).mapboxgl.accessToken = apiKey;
      console.log('Using custom Mapbox API key');
    } else {
      // Use the default configuration
      initializeMapbox();
    }
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const mapbox = getMapbox();
      
      map.current = new mapbox.Map({
        container: mapContainer.current,
        style: MAPBOX_CONFIG.defaultStyle,
        center: MAPBOX_CONFIG.defaultCenter,
        zoom: MAPBOX_CONFIG.defaultZoom
      });

      // Add navigation controls
      map.current.addControl(new mapbox.NavigationControl(), 'top-right');

      // Handle map clicks
      map.current.on('click', handleMapClick);

      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Failed to initialize map:', error);
      toast.error('Erreur lors de l\'initialisation de la carte');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle map click
  const handleMapClick = async (e: any) => {
    const { lng, lat } = e.lngLat;
    
    try {
      setIsLoading(true);
      const result = await reverseGeocode([lng, lat]);
      
      if (result.features && result.features.length > 0) {
        const address = result.features[0].place_name;
        toast.success(`Adresse: ${address}`);
        
        // Add marker
        if (marker.current) {
          marker.current.remove();
        }
        
        marker.current = new (window as any).mapboxgl.Marker({
          color: '#3B82F6'
        })
        .setLngLat([lng, lat])
        .addTo(map.current);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      toast.error('Erreur lors de la récupération de l\'adresse');
    } finally {
      setIsLoading(false);
    }
  };

  // Search for address
  const searchAddress = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const result = await geocodeAddress(searchQuery);
      
      if (result.features && result.features.length > 0) {
        const feature = result.features[0];
        const [lng, lat] = feature.center;
        
        // Fly to location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 15
        });

        // Add marker
        if (marker.current) {
          marker.current.remove();
        }
        
        marker.current = new (window as any).mapboxgl.Marker({
          color: '#10B981'
        })
        .setLngLat([lng, lat])
        .addTo(map.current);

        toast.success(`Trouvé: ${feature.place_name}`);
      } else {
        toast.error('Aucune adresse trouvée');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate route example
  const calculateRouteExample = async () => {
    try {
      setIsLoading(true);
      
      // Example coordinates (Brazzaville to Pointe-Noire)
      const from: [number, number] = [15.2429, -4.2634]; // Brazzaville
      const to: [number, number] = [11.8636, -4.7989]; // Pointe-Noire
      
      const route = await calculateRoute(from, to, 'driving');
      
      if (route.routes && route.routes.length > 0) {
        const routeInfo = route.routes[0];
        setRouteInfo({
          distance: formatDistance(routeInfo.distance / 1000),
          duration: formatDuration(routeInfo.duration / 60)
        });
        
        toast.success('Itinéraire calculé');
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      toast.error('Erreur lors du calcul de l\'itinéraire');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Exemple d'utilisation Mapbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher une adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            />
            <Button onClick={searchAddress} disabled={isLoading}>
              {isLoading ? 'Recherche...' : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {/* Route calculation */}
          <Button onClick={calculateRouteExample} disabled={isLoading}>
            Calculer un itinéraire (exemple)
          </Button>

          {/* Route info */}
          {routeInfo && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Informations d'itinéraire</h4>
              <p className="text-sm text-green-600">
                Distance: {routeInfo.distance} | Durée: {routeInfo.duration}
              </p>
            </div>
          )}

          {/* Map container */}
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg border border-gray-200"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapboxExample; 