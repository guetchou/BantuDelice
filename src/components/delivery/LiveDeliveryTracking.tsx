import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Bike, MapPin, Store, Package, Check, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const restaurantIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to update map view
function MapViewUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface DeliveryLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface DeliveryStatus {
  status: 'assigned' | 'picked_up' | 'on_the_way' | 'delivered';
  timestamp: string;
  message: string;
}

interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle_type: 'bike' | 'car' | 'scooter';
  profile_picture?: string;
}

interface DestinationAddress {
  latitude: number;
  longitude: number;
  address: string;
}

interface RestaurantLocation {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

interface LiveDeliveryTrackingProps {
  orderId: string;
  onContactDriver?: () => void;
}

const LiveDeliveryTracking = ({ orderId, onContactDriver }: LiveDeliveryTrackingProps) => {
  const [deliveryDriver, setDeliveryDriver] = useState<DeliveryDriver | null>(null);
  const [driverLocation, setDriverLocation] = useState<DeliveryLocation | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<DestinationAddress | null>(null);
  const [restaurantLocation, setRestaurantLocation] = useState<RestaurantLocation | null>(null);
  const [previousLocations, setPreviousLocations] = useState<DeliveryLocation[]>([]);
  const [estimatedArrival, setEstimatedArrival] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchDeliveryDetails = async () => {
      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, restaurants(*)')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        // Set restaurant location
        if (orderData.restaurants) {
          setRestaurantLocation({
            latitude: orderData.restaurants.latitude || 0,
            longitude: orderData.restaurants.longitude || 0,
            name: orderData.restaurants.name,
            address: orderData.restaurants.address
          });
        }

        // Set destination address from order
        setDestinationAddress({
          latitude: orderData.delivery_latitude || 0,
          longitude: orderData.delivery_longitude || 0,
          address: orderData.delivery_address
        });

        // Fetch delivery request
        const { data: deliveryRequestData, error: deliveryRequestError } = await supabase
          .from('delivery_requests')
          .select('*')
          .eq('order_id', orderId)
          .single();

        if (deliveryRequestError && deliveryRequestError.code !== 'PGRST116') {
          throw deliveryRequestError;
        }

        if (deliveryRequestData && deliveryRequestData.assigned_driver_id) {
          // Fetch driver details
          const { data: driverData, error: driverError } = await supabase
            .from('delivery_drivers')
            .select('*')
            .eq('id', deliveryRequestData.assigned_driver_id)
            .single();

          if (driverError) throw driverError;

          setDeliveryDriver({
            id: driverData.id,
            name: driverData.name || 'Driver',
            phone: driverData.phone || 'N/A',
            rating: driverData.average_rating || 4.5,
            vehicle_type: driverData.vehicle_type || 'bike',
            profile_picture: driverData.profile_picture
          });

          // Set latest driver location
          setDriverLocation({
            latitude: driverData.current_latitude || 0,
            longitude: driverData.current_longitude || 0,
            timestamp: driverData.last_location_update || new Date().toISOString()
          });

          // Fetch tracking data
          const { data: trackingData, error: trackingError } = await supabase
            .from('delivery_tracking')
            .select('*')
            .eq('order_id', orderId)
            .order('timestamp', { ascending: false });

          if (trackingError) throw trackingError;

          if (trackingData && trackingData.length > 0) {
            setPreviousLocations(
              trackingData.map((track) => ({
                latitude: track.latitude,
                longitude: track.longitude,
                timestamp: track.timestamp
              }))
            );

            // Get the latest status update
            setDeliveryStatus({
              status: trackingData[0].status as any,
              timestamp: trackingData[0].timestamp,
              message: getStatusMessage(trackingData[0].status)
            });

            // Calculate estimated arrival (simplified)
            if (trackingData[0].status === 'picked_up' || trackingData[0].status === 'on_the_way') {
              const estimatedTime = new Date();
              estimatedTime.setMinutes(estimatedTime.getMinutes() + 15);
              setEstimatedArrival(estimatedTime.toLocaleTimeString());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching delivery details:', error);
        toast.error('Impossible de charger les détails de livraison');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();

    // Subscribe to real-time updates
    const deliveryTrackingChannel = supabase
      .channel(`delivery_tracking:${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'delivery_tracking',
        filter: `order_id=eq.${orderId}`
      }, (payload) => {
        const newLocation = {
          latitude: payload.new.latitude,
          longitude: payload.new.longitude,
          timestamp: payload.new.timestamp
        };

        setDriverLocation(newLocation);
        setPreviousLocations(prev => [newLocation, ...prev]);
        
        setDeliveryStatus({
          status: payload.new.status as any,
          timestamp: payload.new.timestamp,
          message: getStatusMessage(payload.new.status)
        });

        // Update estimated arrival
        if (payload.new.status === 'picked_up' || payload.new.status === 'on_the_way') {
          const estimatedTime = new Date();
          estimatedTime.setMinutes(estimatedTime.getMinutes() + 15);
          setEstimatedArrival(estimatedTime.toLocaleTimeString());
        }
      })
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(deliveryTrackingChannel);
    };
  }, [orderId]);

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case 'assigned': return 'Commande attribuée au livreur';
      case 'picked_up': return 'Commande récupérée, en route vers votre adresse';
      case 'on_the_way': return 'Le livreur est en route';
      case 'delivered': return 'Commande livrée avec succès';
      default: return 'Statut inconnu';
    }
  };

  const getProgressValue = (): number => {
    if (!deliveryStatus) return 0;
    
    switch (deliveryStatus.status) {
      case 'assigned': return 25;
      case 'picked_up': return 50;
      case 'on_the_way': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const handleContactDriver = () => {
    if (!deliveryDriver) return;
    
    if (onContactDriver) {
      onContactDriver();
    } else {
      window.location.href = `tel:${deliveryDriver.phone}`;
    }
  };

  const handleSendMessage = () => {
    toast.info('Fonctionnalité de messagerie en développement');
  };

  if (loading) {
    return (
      <Card className="p-6 my-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-t-2 border-orange-500 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!deliveryDriver || !driverLocation) {
    return (
      <Card className="p-6 my-4">
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Pas encore de livreur assigné</h3>
          <p className="text-gray-500">Le restaurant est en train de préparer votre commande.</p>
        </div>
      </Card>
    );
  }

  // Calculate map center
  const calculateMapCenter = (): [number, number] => {
    if (!driverLocation || !destinationAddress) {
      return [-4.2634, 15.2429]; // Default to Brazzaville
    }
    
    return [
      (driverLocation.latitude + destinationAddress.latitude) / 2,
      (driverLocation.longitude + destinationAddress.longitude) / 2
    ];
  };

  // Prepare route for polyline
  const getRoute = (): [number, number][] => {
    const points: [number, number][] = [];
    
    if (restaurantLocation) {
      points.push([restaurantLocation.latitude, restaurantLocation.longitude]);
    }
    
    if (driverLocation) {
      points.push([driverLocation.latitude, driverLocation.longitude]);
    }
    
    if (destinationAddress) {
      points.push([destinationAddress.latitude, destinationAddress.longitude]);
    }
    
    return points;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Suivi de Livraison</h3>
            <p className="text-sm text-gray-500">Commande #{orderId.slice(0, 8)}</p>
          </div>
          <Badge 
            className={
              deliveryStatus?.status === 'delivered' 
                ? 'bg-green-500' 
                : 'bg-orange-500 animate-pulse'
            }
          >
            {deliveryStatus?.status === 'delivered' ? 'Livré' : 'En cours'}
          </Badge>
        </div>

        <Progress value={getProgressValue()} className="h-2 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <Store className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <p className="text-sm font-medium">Préparation</p>
            <div className={`h-2 w-2 rounded-full mx-auto mt-1 ${getProgressValue() >= 25 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className="text-center">
            <Package className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <p className="text-sm font-medium">Récupération</p>
            <div className={`h-2 w-2 rounded-full mx-auto mt-1 ${getProgressValue() >= 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className="text-center">
            <Bike className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <p className="text-sm font-medium">En route</p>
            <div className={`h-2 w-2 rounded-full mx-auto mt-1 ${getProgressValue() >= 75 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className="text-center">
            <Check className="h-6 w-6 mx-auto mb-2 text-gray-500" />
            <p className="text-sm font-medium">Livré</p>
            <div className={`h-2 w-2 rounded-full mx-auto mt-1 ${getProgressValue() >= 100 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        {deliveryStatus && (
          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <p className="font-medium text-orange-800">{deliveryStatus.message}</p>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(deliveryStatus.timestamp).toLocaleTimeString()}
            </p>
            {estimatedArrival && deliveryStatus.status !== 'delivered' && (
              <p className="text-sm font-medium text-gray-800 mt-2">
                Arrivée estimée : {estimatedArrival}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
          <div className="relative mr-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              {deliveryDriver.profile_picture ? (
                <img 
                  src={deliveryDriver.profile_picture} 
                  alt={deliveryDriver.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <Bike className="h-6 w-6 text-gray-500" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{deliveryDriver.name}</h4>
            <div className="flex items-center text-sm text-gray-500">
              <div className="flex items-center mr-4">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{deliveryDriver.rating.toFixed(1)}</span>
              </div>
              <span>{deliveryDriver.vehicle_type === 'bike' ? 'À vélo' : 
                deliveryDriver.vehicle_type === 'car' ? 'En voiture' : 'En scooter'}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="icon" variant="outline" onClick={handleContactDriver}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleSendMessage}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="h-[300px] rounded-lg overflow-hidden relative">
          <MapContainer
            center={calculateMapCenter()}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {restaurantLocation && (
              <Marker 
                position={[restaurantLocation.latitude, restaurantLocation.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{restaurantLocation.name}</h3>
                    <p className="text-sm">{restaurantLocation.address}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {driverLocation && (
              <Marker 
                position={[driverLocation.latitude, driverLocation.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{deliveryDriver.name}</h3>
                    <p className="text-sm">Votre livreur</p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {destinationAddress && (
              <Marker position={[destinationAddress.latitude, destinationAddress.longitude]}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">Votre adresse</h3>
                    <p className="text-sm">{destinationAddress.address}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            <Polyline 
              positions={getRoute()}
            />
          </MapContainer>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-gray-600">{destinationAddress?.address || 'Adresse de livraison'}</p>
        </div>
      </Card>
    </div>
  );
};

export default LiveDeliveryTracking;
