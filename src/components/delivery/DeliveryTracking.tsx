
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, MessageSquare, PhoneCall, Star, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTableExistence } from '@/hooks/useTableExistence';
import DeliveryRating from '@/components/delivery/DeliveryRating';
import { DeliveryDriver, DeliveryRequest, DeliveryStatus } from '@/types/delivery';

interface DeliveryTrackingProps {
  orderId: string;
}

const DeliveryTracking = ({ orderId }: DeliveryTrackingProps) => {
  const [loading, setLoading] = useState(true);
  const [deliveryData, setDeliveryData] = useState<DeliveryRequest | null>(null);
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  const [showRating, setShowRating] = useState(false);
  const { toast } = useToast();
  const { exists: deliveryTrackingExists } = useTableExistence('delivery_tracking');
  const { exists: deliveryRequestsExists } = useTableExistence('delivery_requests');
  const { exists: deliveryDriversExists } = useTableExistence('delivery_drivers');
  
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        setLoading(true);
        
        if (!deliveryRequestsExists) {
          return;
        }
        
        // Get delivery request for this order
        const { data: requestData, error: requestError } = await supabase
          .from('delivery_requests')
          .select('*')
          .eq('order_id', orderId)
          .single();
          
        if (requestError && requestError.code !== 'PGRST116') {
          throw requestError;
        }
        
        if (requestData) {
          setDeliveryData(requestData as DeliveryRequest);
          if (requestData.status) {
            setDeliveryStatus(requestData.status as DeliveryStatus);
          }
          
          // If there's an assigned driver, get driver info
          if (requestData.driver_id && deliveryDriversExists) {
            const { data: driverData, error: driverError } = await supabase
              .from('delivery_drivers')
              .select('*')
              .eq('id', requestData.driver_id)
              .single();
              
            if (driverError) throw driverError;
            
            if (driverData) {
              setDriver(driverData as DeliveryDriver);
            }
          }
        }
        
        // Check if delivery status is available from tracking data
        if (deliveryTrackingExists) {
          const { data: trackingData, error: trackingError } = await supabase
            .from('delivery_tracking')
            .select('status')
            .eq('order_id', orderId)
            .order('timestamp', { ascending: false })
            .limit(1);
            
          if (trackingError) throw trackingError;
          
          if (trackingData && trackingData.length > 0 && trackingData[0].status) {
            setDeliveryStatus(trackingData[0].status as DeliveryStatus);
          }
        }
        
        // Check if rating was already submitted
        const { data: ratingData, error: ratingError } = await supabase
          .from('delivery_driver_ratings')
          .select('id')
          .eq('order_id', orderId)
          .limit(1);
          
        if (ratingError && ratingError.code !== 'PGRST116') {
          console.error('Error checking rating:', ratingError);
        }
        
        if (ratingData && ratingData.length > 0) {
          setRatingSubmitted(true);
        }
        
      } catch (err) {
        console.error('Error fetching delivery data:', err);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données de livraison',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeliveryData();
    
    // Setup real-time updates for delivery status
    const deliveryChannel = supabase
      .channel(`delivery-${orderId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'delivery_tracking',
        filter: `order_id=eq.${orderId}`
      }, (payload) => {
        if (payload.new && (payload.new as any).status) {
          setDeliveryStatus((payload.new as any).status as DeliveryStatus);
          
          // If delivered, show rating option
          if ((payload.new as any).status === 'delivered') {
            setShowRating(true);
          }
        }
      })
      .subscribe();
      
    // Get updates to delivery_requests
    const requestChannel = supabase
      .channel(`delivery-request-${orderId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'delivery_requests',
        filter: `order_id=eq.${orderId}`
      }, (payload) => {
        if (payload.new) {
          setDeliveryData(payload.new as DeliveryRequest);
          
          // If there's an assigned driver, reload driver info
          if ((payload.new as any).driver_id && deliveryDriversExists) {
            fetchDriverInfo((payload.new as any).driver_id);
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(deliveryChannel);
      supabase.removeChannel(requestChannel);
    };
  }, [orderId, deliveryRequestsExists, deliveryDriversExists, deliveryTrackingExists]);
  
  const fetchDriverInfo = async (driverId: string) => {
    const { data, error } = await supabase
      .from('delivery_drivers')
      .select('*')
      .eq('id', driverId)
      .single();
      
    if (error) {
      console.error('Error fetching driver info:', error);
      return;
    }
    
    if (data) {
      setDriver(data);
    }
  };
  
  const handleCallDriver = () => {
    if (driver && driver.phone) {
      window.location.href = `tel:${driver.phone}`;
    }
  };
  
  const handleRatingSubmitted = () => {
    setRatingSubmitted(true);
    toast({
      title: 'Merci !',
      description: 'Votre évaluation a été enregistrée',
    });
  };
  
  const getStatusBadge = () => {
    if (!deliveryStatus) return null;
    
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-blue-100 text-blue-800',
      'picked_up': 'bg-indigo-100 text-indigo-800',
      'delivering': 'bg-orange-100 text-orange-800 animate-pulse',
      'delivered': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    
    const statusLabels: Record<string, string> = {
      'pending': 'En attente',
      'assigned': 'Livreur assigné',
      'accepted': 'Commande acceptée',
      'picked_up': 'Commande récupérée',
      'delivering': 'En livraison',
      'delivered': 'Livré',
      'completed': 'Terminé',
      'cancelled': 'Annulé',
    };
    
    return (
      <Badge className={statusColors[deliveryStatus] || 'bg-gray-100'}>
        {statusLabels[deliveryStatus] || deliveryStatus}
      </Badge>
    );
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // No delivery data or order not in delivery yet
  if (!deliveryData && !deliveryStatus) {
    return null; // Don't show anything if no delivery yet
  }
  
  const isDeliveryComplete = deliveryStatus === 'delivered' || deliveryStatus === 'completed';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Suivi de livraison
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {driver && (
          <div className="flex items-center p-4 bg-muted/30 rounded-lg mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              {driver.profile_picture ? (
                <img 
                  src={driver.profile_picture} 
                  alt={driver.name} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-semibold">{driver.name || 'Livreur'}</h3>
                {driver.average_rating > 0 && (
                  <div className="flex items-center ml-2 text-yellow-500">
                    <Star className="h-3.5 w-3.5 mr-0.5 fill-current" />
                    <span className="text-sm">{driver.average_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {deliveryStatus === 'accepted' ? 'En route vers le restaurant' :
                 deliveryStatus === 'picked_up' ? 'A récupéré votre commande' :
                 deliveryStatus === 'delivering' ? 'En route vers votre adresse' :
                 isDeliveryComplete ? 'A livré votre commande' : 
                 'Assigné à votre commande'}
              </p>
              
              {(deliveryStatus === 'picked_up' || deliveryStatus === 'delivering') && (
                <div className="flex mt-2 space-x-2">
                  {driver.phone && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 px-2 text-xs"
                      onClick={handleCallDriver}
                    >
                      <PhoneCall className="h-3.5 w-3.5 mr-1" />
                      Appeler
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 px-2 text-xs"
                    disabled // For future implementation of in-app messaging
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {deliveryData && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-medium">Adresse de livraison</span>
                <p className="text-sm">
                  {deliveryData.delivery_address || 'Adresse non disponible'}
                </p>
              </div>
            </div>
            
            {deliveryData.estimated_duration && (
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Temps estimé</span>
                  <p className="text-sm">
                    {deliveryData.estimated_duration} minutes
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {isDeliveryComplete && !ratingSubmitted && showRating && driver && (
          <div className="mt-4">
            <DeliveryRating 
              orderId={orderId}
              restaurantId={deliveryData?.restaurant_id || ''} 
              onRatingSubmitted={handleRatingSubmitted}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryTracking;
