import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Truck, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Play,
  Pause,
  Target
} from 'lucide-react';

// Configuration OpenStreetMap
const MAP_CONFIG = {
  center: [-4.2634, 15.2429], // Brazzaville
  zoom: 13,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors'
};

interface RealTimeTrackingProps {
  trackingNumber: string;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({
  trackingNumber,
  onLocationUpdate
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    // Charger Leaflet dynamiquement
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Charger CSS Leaflet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Charger JS Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    // Initialiser la carte
    mapInstance.current = window.L.map(mapRef.current).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

    // Ajouter la couche de tuiles OpenStreetMap
    window.L.tileLayer(MAP_CONFIG.tileLayer, {
      attribution: MAP_CONFIG.attribution,
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Créer le marqueur
    markerRef.current = window.L.marker(MAP_CONFIG.center, {
      icon: window.L.divIcon({
        className: 'custom-marker',
        html: '<div class="bg-orange-500 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><Truck className="w-3 h-3 text-white" /></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(mapInstance.current);

    // Ajouter le popup
    markerRef.current.bindPopup(`
      <div class="p-2">
        <h3 class="font-semibold text-sm">Livreur en route</h3>
        <p class="text-xs text-gray-600">Numéro: ${trackingNumber}</p>
        <p class="text-xs text-gray-600">Statut: En livraison</p>
      </div>
    `);

    // Simuler la connexion WebSocket
    simulateWebSocketConnection();
  };

  const simulateWebSocketConnection = () => {
    setConnectionStatus('connecting');
    
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Simuler des mises à jour de position
      if (isTracking) {
        startLocationSimulation();
      }
    }, 1000);
  };

  const startLocationSimulation = () => {
    const positions = [
      [-4.2634, 15.2429], // Centre-ville
      [-4.2650, 15.2440], // Quartier Bacongo
      [-4.2670, 15.2460], // Avenue de la Paix
      [-4.2690, 15.2480], // Zone industrielle
      [-4.2710, 15.2500], // Périphérie nord
      [-4.2730, 15.2520]  // Destination finale
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (!isTracking) {
        clearInterval(interval);
        return;
      }

      const [lat, lng] = positions[currentIndex];
      updateMarkerPosition(lat, lng);
      
      currentIndex = (currentIndex + 1) % positions.length;
    }, 3000);

    return () => clearInterval(interval);
  };

  const updateMarkerPosition = (lat: number, lng: number) => {
    if (!markerRef.current || !mapInstance.current) return;

    const newPosition = [lat, lng];
    markerRef.current.setLatLng(newPosition);
    mapInstance.current.setView(newPosition, 15);

    setCurrentLocation({ lat, lng });
    onLocationUpdate?.({ lat, lng });

    // Mettre à jour l'heure d'arrivée estimée
    const estimatedTime = new Date(Date.now() + 15 * 60 * 1000); // +15 minutes
    setEstimatedArrival(estimatedTime.toLocaleTimeString());
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    
    if (!isTracking) {
      startLocationSimulation();
    }
  };

  const centerOnMarker = () => {
    if (currentLocation && mapInstance.current) {
      mapInstance.current.setView([currentLocation.lat, currentLocation.lng], 15);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            Tracking GPS Temps Réel
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={isConnected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {connectionStatus === 'connecting' ? 'Connexion...' : 
               connectionStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Carte */}
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border border-gray-200"
          style={{ minHeight: '256px' }}
        />

        {/* Contrôles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleTracking}
              variant={isTracking ? "destructive" : "default"}
              size="sm"
              className="flex items-center gap-2"
            >
              {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isTracking ? 'Arrêter' : 'Démarrer'} le tracking
            </Button>
            
            <Button
              onClick={centerOnMarker}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Centrer
            </Button>
          </div>

          <Button
            onClick={() => window.location.reload()}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {/* Informations */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-orange-500" />
            <span>Position actuelle:</span>
          </div>
          <div className="text-gray-600">
            {currentLocation 
              ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
              : 'Non disponible'
            }
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Arrivée estimée:</span>
          </div>
          <div className="text-gray-600">
            {estimatedArrival || 'Calcul en cours...'}
          </div>

          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-green-500" />
            <span>Statut:</span>
          </div>
          <div className="text-gray-600">
            {isTracking ? 'En livraison' : 'En attente'}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Instructions:</strong> Cliquez sur "Démarrer le tracking" pour simuler 
            le suivi GPS en temps réel. La position du livreur sera mise à jour toutes les 3 secondes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeTracking; 