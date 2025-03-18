
import { useParams } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import OrderTracking from '@/components/orders/OrderTracking';
import OrderProgress from '@/components/orders/OrderProgress';
import LiveTracking from '@/components/delivery/LiveTracking';
import DeliveryAssignment from '@/components/delivery/DeliveryAssignment';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrders();
  const [restaurantLocation, setRestaurantLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<{name: string, is_open: boolean} | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (orderId) {
      // Fetch restaurant location for the delivery tracking
      const fetchRestaurantLocation = async () => {
        const { data: order } = await supabase
          .from('orders')
          .select('restaurant_id')
          .eq('id', orderId)
          .single();
          
        if (order) {
          const { data: restaurant } = await supabase
            .from('restaurants')
            .select('latitude, longitude, name, is_open')
            .eq('id', order.restaurant_id)
            .single();
            
          if (restaurant) {
            setRestaurantLocation({
              latitude: restaurant.latitude || 0,
              longitude: restaurant.longitude || 0
            });
            setRestaurantInfo({
              name: restaurant.name,
              is_open: restaurant.is_open
            });
          }
        }
      };
      
      fetchRestaurantLocation();
    }
  }, [orderId]);

  const sendSpecialInstructions = async () => {
    if (!orderId || !specialInstructions.trim()) return;
    
    try {
      // First, check if a support_ticket exists for this order
      const { data: existingTicket, error: ticketCheckError } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('order_id', orderId)
        .maybeSingle();
        
      if (ticketCheckError) throw ticketCheckError;
      
      let ticketId;
      
      if (existingTicket) {
        ticketId = existingTicket.id;
        
        // Add message to existing ticket
        const { error: messageError } = await supabase
          .from('support_messages')
          .insert({
            ticket_id: ticketId,
            message: specialInstructions,
            sender_type: 'customer'
          });
          
        if (messageError) throw messageError;
      } else {
        // Create a new ticket
        const { data: newTicket, error: createTicketError } = await supabase
          .from('support_tickets')
          .insert({
            order_id: orderId,
            subject: `Instructions spéciales pour commande #${orderId.slice(0, 8)}`,
            status: 'open',
            priority: 'medium',
            customer_id: orders.find(o => o.id === orderId)?.user_id
          })
          .select()
          .single();
          
        if (createTicketError) throw createTicketError;
        
        ticketId = newTicket.id;
        
        // Add the first message
        const { error: messageError } = await supabase
          .from('support_messages')
          .insert({
            ticket_id: ticketId,
            message: specialInstructions,
            sender_type: 'customer'
          });
          
        if (messageError) throw messageError;
      }
      
      // Update the orders table with the special instructions
      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({
          delivery_instructions: specialInstructions
        })
        .eq('id', orderId);
        
      if (orderUpdateError) throw orderUpdateError;
      
      toast({
        title: "Instructions envoyées",
        description: "Vos instructions spéciales ont été envoyées au restaurant",
      });
      
      setIsMessageDialogOpen(false);
      setSpecialInstructions('');
    } catch (error) {
      console.error('Error sending special instructions:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer vos instructions spéciales",
        variant: "destructive"
      });
    }
  };

  if (!orderId) {
    return <div>Commande non trouvée</div>;
  }

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Détails de la commande #{order.id.slice(0, 8)}</h1>
      
      {restaurantInfo && !restaurantInfo.is_open && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Restaurant temporairement fermé</h3>
            <p className="text-sm">
              {restaurantInfo.name} est actuellement fermé. Votre commande sera traitée dès leur réouverture.
            </p>
          </div>
        </div>
      )}
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Statut de la commande</h2>
        <OrderProgress status={order.status} orderId={orderId} />
        
        {(order.status === 'pending' || order.status === 'accepted' || order.status === 'preparing') && (
          <div className="mt-4">
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Ajouter des instructions spéciales
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Instructions spéciales</DialogTitle>
                  <DialogDescription>
                    Ajoutez des instructions spéciales pour votre commande ou le livreur
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Ex: Sonner au 3ème étage, préférence sur la cuisson, allergies..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={5}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={sendSpecialInstructions}>
                    Envoyer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Status:</p>
              <Badge>{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Total:</p>
              <p className="font-medium">{order.total_amount.toLocaleString()} XAF</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Adresse:</p>
              <p className="text-right max-w-[200px]">{order.delivery_address}</p>
            </div>
            {order.delivery_instructions && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <p className="font-medium mb-1">Instructions:</p>
                <p>{order.delivery_instructions}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Composant de suivi en temps réel */}
        <OrderTracking orderId={orderId} />
      </div>

      {/* Assignation de livreur si nécessaire */}
      {order.status === 'prepared' && order.delivery_status !== 'assigned' && restaurantLocation && (
        <DeliveryAssignment 
          orderId={orderId}
          restaurantLocation={restaurantLocation}
          deliveryAddress={order.delivery_address || ''}
        />
      )}

      {/* Carte de suivi de livraison */}
      <LiveTracking orderId={orderId} />
    </div>
  );
}
