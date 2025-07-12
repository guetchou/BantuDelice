import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  MapPin, 
  Clock, 
  Star, 
  Truck, 
  Crosshair,
  Loader2,
  Navigation
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationService } from '@/services/geolocationService';

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string;
  image_url?: string;
  average_rating: number;
  delivery_fee: number;
  average_prep_time: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export default function NearbyRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'delivery_fee'>('distance');

  const {
    coordinates: userCoordinates,
    loading: locationLoading,
    requestPosition,
    formatDistance,
    getDistanceTo
  } = useGeolocation();

  // Charger les restaurants à proximité
  const loadNearbyRestaurants = async () => {
    if (!userCoordinates) {
      toast.error('Position non disponible');
      return;
    }

    setLoading(true);

    try {
      const [lng, lat] = userCoordinates;
      const nearbyRestaurants = await GeolocationService.findNearbyRestaurants(lat, lng, selectedRadius);
      
      // Ajouter les distances calculées
      const restaurantsWithDistance = nearbyRestaurants.map(restaurant => ({
        ...restaurant,
        distance: getDistanceTo?.(restaurant.latitude || 0, restaurant.longitude || 0) || 0
      }));

      // Trier les restaurants
      const sortedRestaurants = sortRestaurants(restaurantsWithDistance, sortBy);
      
      setRestaurants(sortedRestaurants);
    } catch (error) {
      console.error('Error loading nearby restaurants:', error);
      toast.error('Erreur lors du chargement des restaurants');
    } finally {
      setLoading(false);
    }
  };

  // Trier les restaurants
  const sortRestaurants = (restaurants: Restaurant[], sortBy: string): Restaurant[] => {
    return [...restaurants].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        case 'delivery_fee':
          return (a.delivery_fee || 0) - (b.delivery_fee || 0);
        default:
          return 0;
      }
    });
  };

  // Mettre à jour la position et charger les restaurants
  const updateLocationAndLoad = async () => {
    try {
      await requestPosition();
      await loadNearbyRestaurants();
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Erreur lors de la mise à jour de la position');
    }
  };

  // Charger les restaurants quand la position change
  useEffect(() => {
    if (userCoordinates) {
      loadNearbyRestaurants();
    }
  }, [userCoordinates, selectedRadius, sortBy]);

  // Obtenir l'icône pour le type de cuisine
  const getCuisineIcon = (cuisineType: string) => {
    const icons: { [key: string]: string } = {
      'african': '🌍',
      'chinese': '🥢',
      'french': '🥖',
      'italian': '🍝',
      'japanese': '🍱',
      'mexican': '🌮',
      'indian': '🍛',
      'thai': '🍜',
      'american': '🍔',
      'seafood': '🐟',
      'pizza': '🍕',
      'burger': '🍔',
      'dessert': '🍰',
      'coffee': '☕',
      'fast_food': '🍟'
    };
    return icons[cuisineType.toLowerCase()] || '🍽️';
  };

  // Formater le temps de préparation
  const formatPrepTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
  };

  // Afficher les étoiles
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Restaurants à proximité</h2>
          <p className="text-gray-600">
            {userCoordinates ? (
              <>
                Basé sur votre position • {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} trouvé{restaurants.length !== 1 ? 's' : ''}
              </>
            ) : (
              'Activez la géolocalisation pour voir les restaurants à proximité'
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={updateLocationAndLoad}
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
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Rayon:</span>
          <select
            value={selectedRadius}
            onChange={(e) => setSelectedRadius(Number(e.target.value))}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={15}>15 km</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Trier par:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value="distance">Distance</option>
            <option value="rating">Note</option>
            <option value="delivery_fee">Frais de livraison</option>
          </select>
        </div>
      </div>

      {/* Liste des restaurants */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Chargement des restaurants...</p>
          </div>
        </div>
      ) : restaurants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun restaurant trouvé</h3>
            <p className="text-gray-600 mb-4">
              Aucun restaurant trouvé dans un rayon de {selectedRadius}km autour de votre position.
            </p>
            <Button onClick={updateLocationAndLoad} variant="outline">
              Actualiser la position
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={restaurant.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop'}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {formatDistance(restaurant.distance || 0)}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-orange-500 text-white">
                    {getCuisineIcon(restaurant.cuisine_type)} {restaurant.cuisine_type}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(restaurant.average_rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({restaurant.average_rating.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatPrepTime(restaurant.average_prep_time)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <span>{restaurant.delivery_fee} FCFA</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      Commander
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistiques */}
      {restaurants.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-orange-500">{restaurants.length}</p>
                <p className="text-sm text-gray-600">Restaurants</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">
                  {(restaurants.reduce((sum, r) => sum + r.average_rating, 0) / restaurants.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">
                  {Math.round(restaurants.reduce((sum, r) => sum + (r.distance || 0), 0) / restaurants.length * 1000)}m
                </p>
                <p className="text-sm text-gray-600">Distance moyenne</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-500">
                  {Math.round(restaurants.reduce((sum, r) => sum + r.delivery_fee, 0) / restaurants.length)} FCFA
                </p>
                <p className="text-sm text-gray-600">Frais de livraison moyens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 