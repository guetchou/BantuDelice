
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { MapPin, MapIcon } from 'lucide-react';
import { useTableExistence } from '@/hooks/useTableExistence';
import { OrderTrackingRoutePoint } from '@/types/orderTracking';
import { LeafletMap, LeafletTileLayer, LeafletMarker, LeafletPopup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveTrackingProps {
  orderId: string;
}

const LiveTracking = ({ orderId }: LiveTrackingProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [deliveryRoute, setDeliveryRoute] = useState<OrderTrackingRoutePoint[]>([]);
  const [restaurant, setRestaurant] = useState<{ name: string; latitude: number; longitude: number } | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<{ address: string; latitude: number; longitude: number } | null>(null);
  const { toast } = useToast();
  const { exists: trackingTableExists } = useTableExistence({ tables: ["delivery_tracking"] });
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Get order details including restaurant and delivery address
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            id, 
            delivery_address,
            restaurant_id,
            restaurants:restaurant_id (
              id, name, latitude, longitude
            )
          `)
          .eq('id', orderId)
          .single();
          
        if (orderError) throw orderError;
        
        if (orderData?.restaurants) {
          setRestaurant({
            name: orderData.restaurants.name || 'Restaurant',
            latitude: orderData.restaurants.latitude || 0,
            longitude: orderData.restaurants.longitude || 0
          });
        }
        
        // Attempt to get delivery address coordinates
        // This would typically come from a geocoding service in a real app
        // For now using dummy coordinates slightly offset from restaurant
        if (orderData?.restaurants) {
          setDeliveryAddress({
            address: orderData.delivery_address || 'Unknown address',
            latitude: (orderData.restaurants.latitude || 0) + 0.01,
            longitude: (orderData.restaurants.longitude || 0) + 0.015
          });
        }
        
        // If tracking table exists, get real-time tracking data
        if (trackingTableExists) {
          await fetchTrackingData();
          
          // Subscribe to real-time updates
          const channel = supabase
            .channel(`order-${orderId}-tracking`)
            .on('postgres_changes', {
              event: '*',
              schema: 'public',
              table: 'delivery_tracking',
              filter: `order_id=eq.${orderId}`
            }, () => {
              fetchTrackingData();
            })
            .subscribe();
            
          return () => {
            supabase.removeChannel(channel);
          };
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load tracking information');
        toast({
          title: 'Error',
          description: 'Unable to load tracking information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTrackingData = async () => {
      // If tracking table exists, get real-time tracking data
      if (trackingTableExists) {
        const { data: trackingData, error: trackingError } = await supabase
          .from('delivery_tracking')
          .select('*')
          .eq('order_id', orderId)
          .order('timestamp', { ascending: true });
          
        if (trackingError) throw trackingError;
        
        if (trackingData && trackingData.length > 0) {
          setDeliveryRoute(
            trackingData.map(point => ({
              latitude: point.latitude,
              longitude: point.longitude,
              timestamp: point.updated_at,
              status: point.status
            }))
          );
          
          // Set current location to the most recent
          const latest = trackingData[trackingData.length - 1];
          setCurrentLocation([latest.latitude, latest.longitude]);
        }
      }
    };
    
    fetchOrderDetails();
  }, [orderId, trackingTableExists]);
  
  // For demo purposes, simulate a moving driver if no tracking data
  useEffect(() => {
    if (!trackingTableExists && restaurant && deliveryAddress && !currentLocation) {
      // Start from restaurant
      let position = [restaurant.latitude, restaurant.longitude];
      
      // Create a path between restaurant and delivery address
      const simulateMovement = setInterval(() => {
        const target = [deliveryAddress.latitude, deliveryAddress.longitude];
        const newLat = position[0] + (target[0] - position[0]) * 0.05;
        const newLng = position[1] + (target[1] - position[1]) * 0.05;
        
        position = [newLat, newLng];
        setCurrentLocation([newLat, newLng]);
        
        setDeliveryRoute(prev => [
          ...prev, 
          {
            latitude: newLat,
            longitude: newLng,
            timestamp: new Date().toISOString(),
            status: 'delivering'
          }
        ]);
        
        // Check if we've reached the target
        if (Math.abs(newLat - target[0]) < 0.001 && Math.abs(newLng - target[1]) < 0.001) {
          clearInterval(simulateMovement);
        }
      }, 2000);
      
      return () => clearInterval(simulateMovement);
    }
  }, [restaurant, deliveryAddress, trackingTableExists, currentLocation]);
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <MapIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If we don't have restaurant or delivery coordinates, show a message
  if (!restaurant && !deliveryAddress) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <MapIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              Tracking information is not available for this order
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate center of map between restaurant and delivery address
  const center = restaurant && deliveryAddress 
    ? [
        (restaurant.latitude + deliveryAddress.latitude) / 2,
        (restaurant.longitude + deliveryAddress.longitude) / 2
      ] as [number, number]
    : currentLocation 
      ? currentLocation 
      : [0, 0] as [number, number];

  const createCustomIcon = (iconName: 'restaurant' | 'home' | 'delivery') => {
    const colors = {
      restaurant: '#8B5CF6', // purple
      home: '#2DD4BF', // teal
      delivery: '#F59E0B', // amber
    };
    
    const color = colors[iconName];
    return divIcon({
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      html: `
        <div style="background-color: ${color}; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px ${color};">
          <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
        </div>
      `
    });
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg font-medium flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Suivi de livraison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full relative">
          {/* La carte Leaflet sera remplacée par un simple placeholder pour éviter les erreurs */}
          <div className="bg-gray-100 h-full w-full flex items-center justify-center">
            <div className="text-center p-4">
              <MapIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Carte de suivi de livraison</p>
              <p className="text-sm text-gray-400">
                {restaurant?.name} → {deliveryAddress?.address}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LiveTracking;
