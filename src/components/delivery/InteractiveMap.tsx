
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocationEnhanced } from '@/hooks/useGeolocationEnhanced';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  initialLat?: number;
  initialLng?: number;
  orderId?: string;
  height?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialLat = -4.2634,
  initialLng = 15.2429,
  orderId,
  height = '400px'
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { location, loading, getLocation } = useGeolocationEnhanced();
  const [currentMarker, setCurrentMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Add initial marker
    const initialMarker = L.marker([initialLat, initialLng])
      .addTo(mapRef.current)
      .bindPopup('Position par défaut - Brazzaville');

    setCurrentMarker(initialMarker);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [initialLat, initialLng]);

  // Update marker when location changes
  useEffect(() => {
    if (location && mapRef.current) {
      // Remove existing marker
      if (currentMarker) {
        mapRef.current.removeLayer(currentMarker);
      }

      // Add new marker at user location
      const newMarker = L.marker([location.latitude, location.longitude])
        .addTo(mapRef.current)
        .bindPopup(`Votre position actuelle${location.accuracy ? ` (précision: ${Math.round(location.accuracy)}m)` : ''}`);

      setCurrentMarker(newMarker);

      // Center map on user location
      mapRef.current.setView([location.latitude, location.longitude], 15);
    }
  }, [location, currentMarker]);

  const handleGetLocation = async () => {
    await getLocation();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Carte interactive</span>
          <Button
            size="sm"
            onClick={handleGetLocation}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            {loading ? 'Localisation...' : 'Ma position'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainerRef}
          style={{ height, width: '100%' }}
          className="rounded-lg border overflow-hidden"
        />
        
        {location && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Position détectée</span>
            </div>
            <div className="text-sm text-green-600 mt-1">
              Latitude: {location.latitude.toFixed(6)}<br />
              Longitude: {location.longitude.toFixed(6)}
              {location.accuracy && (
                <><br />Précision: {Math.round(location.accuracy)}m</>
              )}
            </div>
          </div>
        )}
        
        {orderId && (
          <div className="mt-2 text-sm text-gray-600">
            Commande: {orderId}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
