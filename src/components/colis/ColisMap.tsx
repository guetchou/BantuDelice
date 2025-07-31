import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle,
  ZoomIn,
  ZoomOut,
  Navigation,
  Globe
} from 'lucide-react';

interface ColisLocation {
  id: string;
  trackingNumber: string;
  status: string;
  currentLocation: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  destination: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  estimatedArrival: string;
  lastUpdate: string;
}

interface ColisMapProps {
  colis?: ColisLocation[];
  selectedColis?: string;
  onColisSelect?: (colisId: string) => void;
  className?: string;
}

const ColisMap: React.FC<ColisMapProps> = ({
  colis = [],
  selectedColis,
  onColisSelect,
  className = ""
}) => {
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({ lat: -4.2634, lng: 15.2429 }); // Brazzaville
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // Mock data pour les colis
  const mockColis: ColisLocation[] = [
    {
      id: '1',
      trackingNumber: 'BD12345678',
      status: 'in_transit',
      currentLocation: {
        lat: -4.2634,
        lng: 15.2429,
        city: 'Brazzaville',
        country: 'Congo'
      },
      destination: {
        lat: -4.7989,
        lng: 11.8363,
        city: 'Pointe-Noire',
        country: 'Congo'
      },
      estimatedArrival: '2024-07-20T14:00:00Z',
      lastUpdate: '2024-07-18T10:30:00Z'
    },
    {
      id: '2',
      trackingNumber: 'BD87654321',
      status: 'delivered',
      currentLocation: {
        lat: -4.7989,
        lng: 11.8363,
        city: 'Pointe-Noire',
        country: 'Congo'
      },
      destination: {
        lat: -4.7989,
        lng: 11.8363,
        city: 'Pointe-Noire',
        country: 'Congo'
      },
      estimatedArrival: '2024-07-15T12:00:00Z',
      lastUpdate: '2024-07-15T11:45:00Z'
    }
  ];

  const displayColis = colis.length > 0 ? colis : mockColis;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'in_transit':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  return (
    <Card className={`bg-white/90 backdrop-blur border-0 shadow-xl ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Globe className="h-5 w-5" />
          Carte des colis
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-100 text-orange-800">
            {displayColis.length} colis
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
            className="border-orange-300 text-orange-700"
          >
            {mapType === 'roadmap' ? 'Satellite' : 'Carte'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Contrôles de la carte */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(5, zoom - 1))}
              className="border-orange-300 text-orange-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">Zoom: {zoom}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(20, zoom + 1))}
              className="border-orange-300 text-orange-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCenter({ lat: -4.2634, lng: 15.2429 })}
            className="border-orange-300 text-orange-700"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Brazzaville
          </Button>
        </div>

        {/* Carte simulée */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-orange-300 h-96 overflow-hidden">
          {/* Légende */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg z-10">
            <h4 className="font-semibold text-gray-800 mb-2">Légende</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Livré</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>En transit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>En attente</span>
              </div>
            </div>
          </div>

          {/* Points sur la carte */}
          {displayColis.map((colisItem) => {
            const distance = calculateDistance(
              colisItem.currentLocation.lat,
              colisItem.currentLocation.lng,
              colisItem.destination.lat,
              colisItem.destination.lng
            );
            
            const isSelected = selectedColis === colisItem.id;
            
            return (
              <div
                key={colisItem.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  isSelected ? 'z-20' : 'z-10'
                }`}
                style={{
                  left: `${50 + (colisItem.currentLocation.lng - center.lng) * 100}%`,
                  top: `${50 - (colisItem.currentLocation.lat - center.lat) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => onColisSelect?.(colisItem.id)}
              >
                {/* Point principal */}
                <div className={`relative ${isSelected ? 'scale-125' : 'scale-100'}`}>
                  <div className={`w-4 h-4 ${getStatusColor(colisItem.status)} rounded-full border-2 border-white shadow-lg flex items-center justify-center`}>
                    {getStatusIcon(colisItem.status)}
                  </div>
                  
                  {/* Info-bulle */}
                  {isSelected && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white/95 backdrop-blur rounded-lg p-3 shadow-xl border border-orange-200 min-w-64">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{colisItem.trackingNumber}</h4>
                        <Badge className={colisItem.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                        colisItem.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-yellow-100 text-yellow-800'}>
                          {colisItem.status === 'delivered' ? 'Livré' : 
                           colisItem.status === 'in_transit' ? 'En transit' : 'En attente'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-orange-500" />
                          <span className="text-gray-600">
                            {colisItem.currentLocation.city}, {colisItem.currentLocation.country}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Truck className="h-3 w-3 text-blue-500" />
                          <span className="text-gray-600">
                            → {colisItem.destination.city}, {colisItem.destination.country}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-600">
                            Arrivée: {formatDate(colisItem.estimatedArrival)}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Distance: {distance} km | Dernière mise à jour: {formatDate(colisItem.lastUpdate)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Message si pas de colis */}
          {displayColis.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun colis à afficher</p>
                <p className="text-sm text-gray-500">Les colis apparaîtront ici</p>
              </div>
            </div>
          )}
        </div>

        {/* Statistiques de la carte */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {displayColis.filter(c => c.status === 'in_transit').length}
            </div>
            <div className="text-sm text-gray-600">En transit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {displayColis.filter(c => c.status === 'delivered').length}
            </div>
            <div className="text-sm text-gray-600">Livrés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {displayColis.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColisMap; 