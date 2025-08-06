import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Truck, 
  User, 
  Phone, 
  Navigation,
  Play,
  Pause,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react';
import { useGPSTracking, LocationData, TrackingInfo } from '@/hooks/useGPSTracking';
import { toast } from 'sonner';

interface RealTimeTrackingProps {
  trackingNumber: string;
  userId: string;
  onStatusChange?: (status: string) => void;
  showMap?: boolean;
  showDriverInfo?: boolean;
  showRoute?: boolean;
}

// Composant de carte simplifiée (en production, utiliser Leaflet ou Google Maps)
const TrackingMap = React.memo<{
  currentLocation: LocationData | null;
  trackingInfo: TrackingInfo | null;
  route: Array<{ lat: number; lng: number }>;
}>(({ currentLocation, trackingInfo, route }) => {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;

    // Simulation d'une carte (en production, intégrer Leaflet ou Google Maps)
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    canvas.style.border = '1px solid #ccc';
    canvas.style.borderRadius = '8px';

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fond de carte
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 400, 300);

      // Dessiner la position actuelle
      if (currentLocation) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(200, 150, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Cercle de précision
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(200, 150, currentLocation.accuracy * 2, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Dessiner la destination
      if (trackingInfo?.route?.waypoints?.length > 0) {
        const destination = trackingInfo.route.waypoints[trackingInfo.route.waypoints.length - 1];
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(350, 50, 6, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Dessiner l'itinéraire
      if (route.length > 1) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.beginPath();
        
        route.forEach((point, index) => {
          const x = 50 + (index * 300) / (route.length - 1);
          const y = 150 - Math.sin(index * 0.5) * 50;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      }
    }

    // Nettoyer et ajouter la nouvelle carte
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(canvas);
  }, [currentLocation, trackingInfo, route]);

  return (
    <div ref={mapRef} className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      {!currentLocation && (
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p>En attente de la position GPS...</p>
        </div>
      )}
    </div>
  );
});

// Composant d'informations du chauffeur
const DriverInfo = React.memo<{
  driverInfo: TrackingInfo['driverInfo'];
}>(({ driverInfo }) => {
  if (!driverInfo) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Chauffeur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {driverInfo.photo && (
            <img 
              src={driverInfo.photo} 
              alt={driverInfo.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium">{driverInfo.name}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {driverInfo.phone}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Composant d'informations de route
const RouteInfo = React.memo<{
  route: TrackingInfo['route'];
  estimatedArrival: Date;
}>(({ route, estimatedArrival }) => {
  const formatDuration = useCallback((minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }, []);

  const formatDistance = useCallback((km: number) => {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Itinéraire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Distance restante</span>
            <span className="font-medium">{formatDistance(route.distance)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Temps estimé</span>
            <span className="font-medium">{formatDuration(route.duration)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Arrivée estimée</span>
            <span className="font-medium">
              {estimatedArrival.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Composant principal de tracking temps réel
const RealTimeTracking: React.FC<RealTimeTrackingProps> = React.memo(({
  trackingNumber,
  userId,
  onStatusChange,
  showMap = true,
  showDriverInfo = true,
  showRoute = true
}) => {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const {
    isConnected,
    isTracking,
    trackingInfo,
    currentLocation,
    trackingHistory,
    events,
    error,
    loading,
    startTracking,
    stopTracking,
    updateLocation,
    fetchTrackingInfo,
    clearError
  } = useGPSTracking({
    trackingNumber,
    userId,
    enableRealTime: true,
    updateInterval: 5000,
    onStatusChange,
    onError: (error) => toast.error(error)
  });

  // Démarrer le tracking automatiquement
  useEffect(() => {
    if (trackingNumber && userId && !isTracking) {
      startTracking();
    }
  }, [trackingNumber, userId, isTracking, startTracking]);

  // Auto-refresh des informations
  useEffect(() => {
    if (!autoRefresh || !isTracking) return;

    const interval = setInterval(() => {
      fetchTrackingInfo();
    }, 10000); // Rafraîchir toutes les 10 secondes

    return () => clearInterval(interval);
  }, [autoRefresh, isTracking, fetchTrackingInfo]);

  // Gestionnaires d'événements
  const handleStartTracking = useCallback(async () => {
    const success = await startTracking();
    if (success) {
      toast.success('Tracking démarré');
    }
  }, [startTracking]);

  const handleStopTracking = useCallback(async () => {
    await stopTracking();
    toast.info('Tracking arrêté');
  }, [stopTracking]);

  const handleRefreshLocation = useCallback(async () => {
    await updateLocation({});
    toast.success('Position mise à jour');
  }, [updateLocation]);

  const handleRefreshInfo = useCallback(async () => {
    await fetchTrackingInfo();
    toast.success('Informations mises à jour');
  }, [fetchTrackingInfo]);

  // Calculs dérivés
  const route = useMemo(() => {
    return trackingInfo?.route?.waypoints || [];
  }, [trackingInfo]);

  const statusColor = useMemo(() => {
    switch (trackingInfo?.status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [trackingInfo?.status]);

  const connectionStatus = useMemo(() => {
    if (!isConnected) return { color: 'text-red-600', text: 'Déconnecté' };
    if (isTracking) return { color: 'text-green-600', text: 'En cours' };
    return { color: 'text-yellow-600', text: 'En attente' };
  }, [isConnected, isTracking]);

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={clearError}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                Suivi en temps réel
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {trackingNumber}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColor}>
                {trackingInfo?.status || 'Inconnu'}
              </Badge>
              <div className={`flex items-center gap-1 text-sm ${connectionStatus.color}`}>
                <div className={`w-2 h-2 rounded-full ${connectionStatus.color.replace('text-', 'bg-')}`} />
                {connectionStatus.text}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {isTracking ? (
              <Button onClick={handleStopTracking} variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                Arrêter
              </Button>
            ) : (
              <Button onClick={handleStartTracking} disabled={loading} size="sm">
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Démarrer
              </Button>
            )}
            
            <Button onClick={handleRefreshLocation} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            
            <Button onClick={handleRefreshInfo} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Infos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Carte de tracking */}
      {showMap && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Position actuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrackingMap
              currentLocation={currentLocation}
              trackingInfo={trackingInfo}
              route={route}
            />
            
            {currentLocation && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Latitude</p>
                  <p className="font-mono">{currentLocation.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Longitude</p>
                  <p className="font-mono">{currentLocation.longitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Précision</p>
                  <p className="font-mono">±{currentLocation.accuracy.toFixed(1)}m</p>
                </div>
                <div>
                  <p className="text-gray-600">Vitesse</p>
                  <p className="font-mono">{currentLocation.speed.toFixed(1)} km/h</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informations du chauffeur */}
      {showDriverInfo && trackingInfo?.driverInfo && (
        <DriverInfo driverInfo={trackingInfo.driverInfo} />
      )}

      {/* Informations de route */}
      {showRoute && trackingInfo?.route && trackingInfo?.estimatedArrival && (
        <RouteInfo 
          route={trackingInfo.route} 
          estimatedArrival={trackingInfo.estimatedArrival} 
        />
      )}

      {/* Historique des événements */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {events.slice(-10).reverse().map((event, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-gray-600">
                    {event.timestamp.toLocaleTimeString('fr-FR')}
                  </span>
                  <span>
                    {event.type === 'location' && 'Position mise à jour'}
                    {event.type === 'status' && `Statut: ${event.data.status}`}
                    {event.type === 'driver' && 'Chauffeur assigné'}
                    {event.type === 'route' && 'Itinéraire optimisé'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

RealTimeTracking.displayName = 'RealTimeTracking';

export default RealTimeTracking; 