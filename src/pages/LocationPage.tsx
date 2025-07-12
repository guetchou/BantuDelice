import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Loader2,
  Map,
  Users,
  Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationService } from '@/services/geolocationService';
import LocationMap from '@/components/location/LocationMap';
import NearbyRestaurants from '@/components/location/NearbyRestaurants';

export default function LocationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('map');
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [userZone, setUserZone] = useState<any>(null);
  const [locationStats, setLocationStats] = useState({
    totalRestaurants: 0,
    averageDistance: 0,
    averageRating: 0,
    totalDeliveryZones: 0
  });

  const {
    coordinates: userCoordinates,
    loading: locationLoading,
    requestPosition,
    formatDistance,
    getDistanceTo,
    accuracy,
    permission
  } = useGeolocation();

  // Charger les zones de livraison
  useEffect(() => {
    const loadDeliveryZones = async () => {
      try {
        const zones = await GeolocationService.getDeliveryZones();
        setDeliveryZones(zones);
        setLocationStats(prev => ({ ...prev, totalDeliveryZones: zones.length }));
      } catch (error) {
        console.error('Error loading delivery zones:', error);
      }
    };

    loadDeliveryZones();
  }, []);

  // Déterminer la zone de l'utilisateur
  useEffect(() => {
    if (userCoordinates && deliveryZones.length > 0) {
      const [lng, lat] = userCoordinates;
      const zone = deliveryZones.find(zone => {
        const distance = GeolocationService.calculateDistance(
          lat, lng, 
          zone.center[1], zone.center[0]
        );
        return distance <= zone.radius;
      });
      setUserZone(zone);
    }
  }, [userCoordinates, deliveryZones]);

  // Mettre à jour la position
  const updateLocation = async () => {
    try {
      await requestPosition();
      toast.success('Position mise à jour');
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Erreur lors de la mise à jour de la position');
    }
  };

  // Gérer la sélection d'une localisation
  const handleLocationSelect = (location: any) => {
    toast.success(`Adresse sélectionnée: ${location.address}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-green-100 text-green-700 font-semibold shadow transition"
            >
              <span className="text-xl">🏠</span> Accueil
            </button>
            <Button
              onClick={updateLocation}
              disabled={locationLoading}
              className="flex items-center gap-2"
            >
              {locationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Crosshair className="w-4 h-4" />
              )}
              Actualiser ma position
            </Button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Géolocalisation</h1>
            <p className="text-gray-600">Trouvez les restaurants à proximité et gérez vos adresses</p>
          </div>

          {/* Statut de géolocalisation */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {permission === 'granted' ? '✅' : permission === 'denied' ? '❌' : '⏳'}
                  </div>
                  <p className="text-sm text-gray-600">Permission</p>
                  <p className="text-xs text-gray-500">{permission}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {userCoordinates ? '📍' : '❓'}
                  </div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="text-xs text-gray-500">
                    {userCoordinates ? 'Détectée' : 'Non disponible'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {accuracy ? `${Math.round(accuracy)}m` : 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">Précision</p>
                  <p className="text-xs text-gray-500">GPS</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {userZone ? userZone.name : 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">Zone</p>
                  <p className="text-xs text-gray-500">Livraison</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Carte
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Restaurants
            </TabsTrigger>
            <TabsTrigger value="zones" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Zones
            </TabsTrigger>
          </TabsList>

          {/* Onglet Carte */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Carte Interactive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationMap
                  onLocationSelect={handleLocationSelect}
                  showSavedLocations={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Restaurants */}
          <TabsContent value="restaurants" className="space-y-6">
            <NearbyRestaurants />
          </TabsContent>

          {/* Onglet Zones de livraison */}
          <TabsContent value="zones" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliveryZones.map((zone) => (
                <Card key={zone.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                      <Badge variant={userZone?.id === zone.id ? "default" : "secondary"}>
                        {userZone?.id === zone.id ? 'Votre zone' : 'Autre zone'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Rayon de livraison:</span>
                        <span className="font-medium">{zone.radius} km</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Frais de livraison:</span>
                        <span className="font-medium text-green-600">{zone.delivery_fee} FCFA</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Commande minimum:</span>
                        <span className="font-medium">{zone.min_order_amount} FCFA</span>
                      </div>
                      
                      {userCoordinates && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium">
                            {formatDistance(GeolocationService.calculateDistance(
                              userCoordinates[1], userCoordinates[0],
                              zone.center[1], zone.center[0]
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {zone.description && (
                      <p className="text-sm text-gray-500 mt-3">{zone.description}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Statistiques des zones */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques des zones de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-500">{deliveryZones.length}</p>
                    <p className="text-sm text-gray-600">Zones totales</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      {deliveryZones.reduce((sum, zone) => sum + zone.delivery_fee, 0) / deliveryZones.length} FCFA
                    </p>
                    <p className="text-sm text-gray-600">Frais moyens</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-500">
                      {Math.round(deliveryZones.reduce((sum, zone) => sum + zone.radius, 0) / deliveryZones.length * 10) / 10} km
                    </p>
                    <p className="text-sm text-gray-600">Rayon moyen</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-500">
                      {userZone ? userZone.name : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Votre zone</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 