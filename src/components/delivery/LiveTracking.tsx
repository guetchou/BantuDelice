
import { useEffect, useState } from 'react';
import LiveDeliveryTracking from './LiveDeliveryTracking';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryRequest, DeliveryDriver } from '@/types/delivery';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface LiveTrackingProps {
  orderId: string;
}

const LiveTracking = ({ orderId }: LiveTrackingProps) => {
  const [deliveryRequest, setDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDeliveryRequest = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('delivery_requests')
          .select('*')
          .eq('order_id', orderId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setDeliveryRequest({
            id: data.id,
            order_id: data.order_id,
            restaurant_id: data.restaurant_id,
            status: data.status,
            pickup_address: data.pickup_address,
            pickup_latitude: data.pickup_latitude,
            pickup_longitude: data.pickup_longitude,
            delivery_address: data.delivery_address,
            delivery_latitude: data.delivery_latitude,
            delivery_longitude: data.delivery_longitude,
            assigned_driver_id: data.assigned_driver_id,
            requested_at: data.requested_at,
            accepted_at: data.accepted_at,
            completed_at: data.completed_at,
            cancelled_at: data.cancelled_at,
            delivery_fee: data.delivery_fee,
            is_external: data.is_external,
            external_service_id: data.external_service_id,
            notes: data.notes,
            priority: data.priority,
            estimated_distance: data.estimated_distance,
            estimated_duration: data.estimated_duration
          });

          if (data.assigned_driver_id) {
            fetchDriver(data.assigned_driver_id);
          }
        }
      } catch (err) {
        console.error('Error fetching delivery request:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDriver = async (driverId: string) => {
      try {
        const { data, error } = await supabase
          .from('delivery_drivers')
          .select('*')
          .eq('id', driverId)
          .single();

        if (error) throw error;

        setDriver({
          id: data.id,
          user_id: data.user_id,
          name: data.name || 'Driver',
          phone: data.phone || '',
          current_latitude: data.current_latitude,
          current_longitude: data.current_longitude,
          current_location: data.current_location,
          is_available: data.is_available,
          status: data.status || 'delivering',
          vehicle_type: data.vehicle_type || 'bike',
          total_deliveries: data.total_deliveries || 0,
          average_rating: data.average_rating || 4.5,
          profile_picture: data.profile_picture,
          restaurant_id: data.restaurant_id,
          commission_rate: data.commission_rate || 0,
          total_earnings: data.total_earnings || 0,
          created_at: data.created_at,
          updated_at: data.updated_at,
          last_location_update: data.last_location_update
        });
      } catch (err) {
        console.error('Error fetching driver:', err);
      }
    };

    fetchDeliveryRequest();

    // Setup realtime subscription for delivery updates
    const deliveryChannel = supabase
      .channel(`delivery_request:${orderId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'delivery_requests',
          filter: `order_id=eq.${orderId}`
        }, 
        (payload) => {
          if (payload.new) {
            setDeliveryRequest(prev => ({
              ...prev,
              ...payload.new
            } as DeliveryRequest));

            if (payload.new.assigned_driver_id && 
                (!deliveryRequest?.assigned_driver_id || 
                payload.new.assigned_driver_id !== deliveryRequest.assigned_driver_id)) {
              fetchDriver(payload.new.assigned_driver_id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(deliveryChannel);
    };
  }, [orderId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !deliveryRequest) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour envoyer un message");
        return;
      }

      const { error } = await supabase.from('delivery_messages').insert({
        delivery_request_id: deliveryRequest.id,
        sender_id: user.id,
        sender_type: 'customer',
        message: message.trim(),
        created_at: new Date().toISOString(),
        read: false
      });

      if (error) throw error;

      toast.success("Message envoyé avec succès");
      setMessage('');
      setDialogOpen(false);
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 my-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-t-2 border-orange-500 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!deliveryRequest) {
    return (
      <Card className="p-6 my-4">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold">Aucune livraison en cours</h3>
          <p className="text-gray-500 mt-2">Cette commande n'a pas encore été assignée à un livreur.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {driver && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                {driver.profile_picture ? (
                  <img 
                    src={driver.profile_picture} 
                    alt={driver.name} 
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-500">
                    {driver.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-medium">{driver.name}</h3>
                <div className="text-sm text-gray-500">
                  <span className="inline-flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {driver.average_rating.toFixed(1)}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{driver.total_deliveries} livraisons</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => window.location.href = `tel:${driver.phone}`}>
                <Phone className="h-4 w-4 mr-1" />
                Appeler
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Envoyer un message au livreur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">
                      Envoyez un message à {driver.name} concernant votre livraison.
                    </p>
                    <Textarea
                      placeholder="Votre message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button onClick={handleSendMessage} className="w-full">
                      Envoyer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      )}

      <LiveDeliveryTracking orderId={orderId} />
    </div>
  );
};

export default LiveTracking;
