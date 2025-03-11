
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DeliveryStatus, DeliveryTracking as DeliveryTrackingType, DeliveryRequest, DeliveryDriver } from '@/types/delivery';
import { Restaurant } from '@/types/restaurant';
import { Order } from '@/types/order';
import { MapPin, Clock, Bike, CheckCircle, Phone, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DeliveryDriverMap from './DeliveryDriverMap';

interface DeliveryTrackingProps {
  orderId: string;
}

export default function DeliveryTracking({ orderId }: DeliveryTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryRequest, setDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const [trackingData, setTrackingData] = useState<DeliveryTrackingType[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
      subscribeToUpdates();
    }
  }, [orderId]);

  const subscribeToUpdates = () => {
    const orderSubscription = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      }, () => {
        fetchOrderData();
      })
      .subscribe();

    const deliverySubscription = supabase
      .channel(`delivery-${orderId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'delivery_requests',
        filter: `order_id=eq.${orderId}`
      }, () => {
        fetchDeliveryRequest();
      })
      .subscribe();

    const trackingSubscription = supabase
      .channel(`tracking-${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'delivery_tracking',
        filter: `delivery_request_id=eq.(SELECT id FROM delivery_requests WHERE order_id = '${orderId}')`
      }, () => {
        fetchTrackingData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
      supabase.removeChannel(deliverySubscription);
      supabase.removeChannel(trackingSubscription);
    };
  };

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      
      setOrder(data);
      
      // Charger le restaurant
      if (data?.restaurant_id) {
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', data.restaurant_id)
          .single();

        if (restaurantError) throw restaurantError;
        setRestaurant(restaurantData);
      }

      // Charger la demande de livraison
      fetchDeliveryRequest();
    } catch (error) {
      console.error('Error fetching order data:', error);
      setError('Impossible de charger les données de la commande');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données de la commande',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_requests')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Pas de demande de livraison trouvée
          setDeliveryRequest(null);
          return;
        }
        throw error;
      }

      setDeliveryRequest(data);

      // Charger les données du livreur si assigné
      if (data?.assigned_driver_id) {
        const { data: driverData, error: driverError } = await supabase
          .from('delivery_drivers')
          .select('*')
          .eq('id', data.assigned_driver_id)
          .single();

        if (driverError) throw driverError;
        setDriver(driverData);
      }

      // Charger les données de suivi
      fetchTrackingData();
    } catch (error) {
      console.error('Error fetching delivery request:', error);
      // Ne pas afficher d'erreur si c'est juste qu'aucune livraison n'est trouvée
    }
  };

  const fetchTrackingData = async () => {
    if (!deliveryRequest?.id) return;

    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('delivery_request_id', deliveryRequest.id)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setTrackingData(data || []);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    }
  };

  const getDeliveryProgress = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending': return 10;
      case 'assigned': return 30;
      case 'picked_up': return 60;
      case 'delivering': return 80;
      case 'delivered': return 100;
      case 'failed': return 100;
      default: return 0;
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending': return 'En attente de livreur';
      case 'assigned': return 'Livreur assigné';
      case 'picked_up': return 'Commande récupérée';
      case 'delivering': return 'En cours de livraison';
      case 'delivered': return 'Livrée';
      case 'failed': return 'Échec de livraison';
      default: return 'Statut inconnu';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDeliveryTime = () => {
    if (!deliveryRequest || !deliveryRequest.pickup_time) return 'Estimation en attente';
    
    // Si la commande est déjà livrée, afficher l'heure de livraison
    if (deliveryRequest.status === 'delivered' && deliveryRequest.delivery_time) {
      return formatTime(deliveryRequest.delivery_time);
    }
    
    // Sinon calculer une estimation basée sur le temps de pick-up et la distance
    const pickupTime = new Date(deliveryRequest.pickup_time);
    // Estimer 5 minutes par km avec un minimum de 10 minutes
    const estimatedMinutes = Math.max(10, Math.round(deliveryRequest.distance_km * 5));
    const estimatedDeliveryTime = new Date(pickupTime.getTime() + estimatedMinutes * 60000);
    
    return formatTime(estimatedDeliveryTime.toISOString());
  };

  const callDriver = () => {
    if (driver?.phone) {
      window.location.href = `tel:${driver.phone}`;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">{error}</h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!deliveryRequest) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Clock className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">En attente de livraison</h3>
            <p className="text-sm text-muted-foreground mt-1">
              La livraison n'a pas encore été assignée. Merci de patienter.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-2 bg-muted/30">
          <CardTitle className="flex items-center justify-between">
            <span>Suivi de livraison</span>
            {deliveryRequest.status === 'delivered' && (
              <span className="text-green-600 flex items-center text-sm font-normal">
                <CheckCircle className="h-4 w-4 mr-1" />
                Livraison terminée
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Barre de progression */}
            <div className="space-y-2">
              <Progress value={getDeliveryProgress(deliveryRequest.status)} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Commande</span>
                <span>Préparation</span>
                <span>Livraison</span>
              </div>
            </div>

            {/* Statut actuel */}
            <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg">
              <div className="flex items-center">
                {deliveryRequest.status === 'delivered' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                ) : (
                  <Bike className="h-5 w-5 text-primary animate-pulse mr-3" />
                )}
                <div>
                  <p className="font-medium">{getStatusLabel(deliveryRequest.status)}</p>
                  <p className="text-sm text-muted-foreground">
                    {deliveryRequest.status === 'delivered' 
                      ? `Livré ${deliveryRequest.delivery_time ? `à ${formatTime(deliveryRequest.delivery_time)}` : ''}` 
                      : `Estimation: ${getEstimatedDeliveryTime()}`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Informations du livreur */}
            {driver && (
              <div className="space-y-3 border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Votre livreur</h3>
                  {driver.status !== 'offline' && (
                    <Button variant="outline" size="sm" onClick={callDriver}>
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    {driver.vehicle_type === 'bike' ? (
                      <Bike className="h-6 w-6 text-primary" />
                    ) : driver.vehicle_type === 'car' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
                        <circle cx="6.5" cy="16.5" r="2.5" />
                        <circle cx="16.5" cy="16.5" r="2.5" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <svg className="h-3 w-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {driver.average_rating.toFixed(1)}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {driver.total_deliveries} livraisons
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Carte de suivi */}
            {deliveryRequest && deliveryRequest.restaurant_id && (
              <>
                <Separator />
                <div className="h-[300px] rounded-lg overflow-hidden">
                  <DeliveryDriverMap 
                    restaurantId={deliveryRequest.restaurant_id} 
                    deliveryId={deliveryRequest.id}
                    height="100%"
                  />
                </div>
              </>
            )}

            {/* Timeline de livraison */}
            {trackingData.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Suivi détaillé</h3>
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-4">
                  {trackingData.map((tracking, index) => (
                    <li key={tracking.id} className="ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3">
                        {index === 0 ? (
                          <MapPin className="w-3 h-3 text-white" />
                        ) : (
                          <span className="text-white text-xs">{index + 1}</span>
                        )}
                      </span>
                      <div className="p-3 bg-white shadow-sm border rounded-lg">
                        <h3 className="font-medium">{getStatusLabel(tracking.status)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(tracking.timestamp)}
                        </p>
                        {tracking.notes && (
                          <p className="text-sm mt-1">{tracking.notes}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Adresse de livraison */}
            <div className="flex items-start space-x-3 bg-muted/30 p-4 rounded-lg">
              <MapPinned className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Adresse de livraison</p>
                <p className="text-muted-foreground">{deliveryRequest.delivery_address}</p>
                {deliveryRequest.delivery_instructions && (
                  <p className="text-sm italic mt-1">{deliveryRequest.delivery_instructions}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
