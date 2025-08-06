import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Building, 
  Clock, 
  Phone, 
  Mail, 
  Navigation,
  Filter,
  Search,
  Star,
  CheckCircle,
  AlertCircle,
  Truck,
  Package
} from 'lucide-react';

interface RelayPoint {
  id: string;
  name: string;
  type: 'post_office' | 'partner' | 'pickup_point';
  address: string;
  city: string;
  coordinates: [number, number];
  phone: string;
  email?: string;
  hours: string;
  services: string[];
  rating: number;
  distance?: number;
  isOpen: boolean;
  capacity: 'low' | 'medium' | 'high';
  features: {
    parking: boolean;
    accessibility: boolean;
    atm: boolean;
    photocopy: boolean;
    packaging: boolean;
  };
}

const RelayPointsMap: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<RelayPoint | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'post_office' | 'partner' | 'pickup_point'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Données des points relais (simulation)
  const relayPoints: RelayPoint[] = [
    {
      id: '1',
      name: 'Bureau de Poste Central Brazzaville',
      type: 'post_office',
      address: 'Avenue de la Paix, Centre-ville',
      city: 'Brazzaville',
      coordinates: [-4.2634, 15.2429],
      phone: '+242 06 123 45 67',
      email: 'bureau.central@poste.cg',
      hours: 'Lun-Ven: 8h-17h, Sam: 8h-12h',
      services: ['Expédition', 'Réception', 'Paiement', 'Assurance'],
      rating: 4.8,
      isOpen: true,
      capacity: 'high',
      features: {
        parking: true,
        accessibility: true,
        atm: true,
        photocopy: true,
        packaging: true
      }
    },
    {
      id: '2',
      name: 'Point Relais Pointe-Noire',
      type: 'partner',
      address: 'Boulevard de la Mer, Quartier Loandjili',
      city: 'Pointe-Noire',
      coordinates: [-4.7989, 11.8363],
      phone: '+242 05 987 65 43',
      hours: 'Lun-Sam: 7h-20h',
      services: ['Réception', 'Stockage', 'Notification'],
      rating: 4.5,
      isOpen: true,
      capacity: 'medium',
      features: {
        parking: false,
        accessibility: true,
        atm: false,
        photocopy: false,
        packaging: true
      }
    },
    {
      id: '3',
      name: 'Agence Postale Dolisie',
      type: 'post_office',
      address: 'Rue du Commerce, Centre-ville',
      city: 'Dolisie',
      coordinates: [-4.1994, 12.6664],
      phone: '+242 06 456 78 90',
      hours: 'Lun-Ven: 8h-16h',
      services: ['Expédition', 'Réception', 'Paiement'],
      rating: 4.2,
      isOpen: false,
      capacity: 'medium',
      features: {
        parking: true,
        accessibility: false,
        atm: false,
        photocopy: true,
        packaging: false
      }
    },
    {
      id: '4',
      name: 'Point Collecte Nkayi',
      type: 'pickup_point',
      address: 'Avenue de l\'Indépendance',
      city: 'Nkayi',
      coordinates: [-4.1833, 13.2833],
      phone: '+242 05 111 22 33',
      hours: 'Lun-Sam: 8h-18h',
      services: ['Réception', 'Stockage'],
      rating: 4.0,
      isOpen: true,
      capacity: 'low',
      features: {
        parking: false,
        accessibility: false,
        atm: false,
        photocopy: false,
        packaging: false
      }
    },
    {
      id: '5',
      name: 'Bureau de Poste Ouesso',
      type: 'post_office',
      address: 'Rue Principale',
      city: 'Ouesso',
      coordinates: [1.6167, 16.0500],
      phone: '+242 06 777 88 99',
      hours: 'Lun-Ven: 8h-15h',
      services: ['Expédition', 'Réception', 'Paiement'],
      rating: 3.8,
      isOpen: true,
      capacity: 'low',
      features: {
        parking: true,
        accessibility: false,
        atm: false,
        photocopy: false,
        packaging: true
      }
    }
  ];

  // Obtenir la position de l'utilisateur
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Erreur de géolocalisation:', error);
        }
      );
    }
  };

  // Calculer la distance
  const calculateDistance = (point: RelayPoint) => {
    if (!userLocation) return null;
    
    const R = 6371; // Rayon de la Terre en km
    const lat1 = userLocation[0] * Math.PI / 180;
    const lat2 = point.coordinates[0] * Math.PI / 180;
    const deltaLat = (point.coordinates[0] - userLocation[0]) * Math.PI / 180;
    const deltaLon = (point.coordinates[1] - userLocation[1]) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Filtrer les points relais
  const filteredPoints = relayPoints
    .filter(point => {
      const matchesType = filterType === 'all' || point.type === filterType;
      const matchesSearch = point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           point.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           point.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    })
    .map(point => ({
      ...point,
      distance: calculateDistance(point)
    }))
    .sort((a, b) => {
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }
      return 0;
    });

  // Initialiser la carte (simulation)
  useEffect(() => {
    if (mapRef.current) {
      // Simulation de chargement de carte
      setTimeout(() => setMapLoaded(true), 1000);
    }
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post_office': return <Building className="h-4 w-4" />;
      case 'partner': return <Package className="h-4 w-4" />;
      case 'pickup_point': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post_office': return 'bg-blue-100 text-blue-800';
      case 'partner': return 'bg-green-100 text-green-800';
      case 'pickup_point': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Points Relais & Bureaux de Poste
        </h2>
        <p className="text-gray-600">
          Trouvez le point de dépôt ou de retrait le plus proche
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Filtres et recherche */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un point relais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type de point</label>
                <div className="space-y-2">
                  {[
                    { id: 'all', name: 'Tous les points', icon: MapPin },
                    { id: 'post_office', name: 'Bureaux de poste', icon: Building },
                    { id: 'partner', name: 'Partenaires', icon: Package },
                    { id: 'pickup_point', name: 'Points de collecte', icon: MapPin }
                  ].map((type) => (
                    <Button
                      key={type.id}
                      variant={filterType === type.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType(type.id as any)}
                      className="w-full justify-start"
                    >
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={getUserLocation}
                className="w-full"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Utiliser ma position
              </Button>
            </CardContent>
          </Card>

          {/* Liste des points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Points Relais ({filteredPoints.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPoints.map((point) => (
                  <div
                    key={point.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedPoint?.id === point.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedPoint(point)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(point.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{point.name}</h4>
                          <Badge className={getTypeColor(point.type)}>
                            {point.type === 'post_office' ? 'Poste' : 
                             point.type === 'partner' ? 'Partenaire' : 'Collecte'}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-1">{point.address}</p>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{point.rating}</span>
                          </div>
                          
                          {point.distance && (
                            <div className="flex items-center gap-1">
                              <Navigation className="h-3 w-3 text-blue-500" />
                              <span>{point.distance.toFixed(1)} km</span>
                            </div>
                          )}
                          
                          <Badge 
                            variant={point.isOpen ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {point.isOpen ? 'Ouvert' : 'Fermé'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carte et détails */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Carte Interactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={mapRef}
                className="h-96 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                {!mapLoaded ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                    <p className="text-gray-600">Chargement de la carte...</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Carte interactive des points relais</p>
                    <p className="text-sm">Intégration Mapbox en cours</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Détails du point sélectionné */}
          {selectedPoint && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedPoint.type)}
                  {selectedPoint.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedPoint.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedPoint.phone}</span>
                      </div>
                      {selectedPoint.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{selectedPoint.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{selectedPoint.hours}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Services & Capacité</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getCapacityColor(selectedPoint.capacity)}>
                          Capacité: {selectedPoint.capacity === 'high' ? 'Élevée' : 
                                    selectedPoint.capacity === 'medium' ? 'Moyenne' : 'Faible'}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {selectedPoint.services.map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div>
                  <h4 className="font-semibold mb-2">Fonctionnalités</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(selectedPoint.features).map(([feature, available]) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        {available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={available ? 'text-gray-700' : 'text-gray-500'}>
                          {feature === 'parking' ? 'Parking' :
                           feature === 'accessibility' ? 'Accessible' :
                           feature === 'atm' ? 'ATM' :
                           feature === 'photocopy' ? 'Photocopie' :
                           feature === 'packaging' ? 'Emballage' : feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">
                    <Navigation className="h-4 w-4 mr-2" />
                    Itinéraire
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelayPointsMap; 