
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/order';
import { DeliveryRequest } from '@/types/delivery';
import DeliveryTracking from '@/components/delivery/DeliveryTracking';
import OrderProgress from '@/components/orders/OrderProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Receipt, Clock, CalendarClock, MapPin, User, Phone, AlertTriangle, Share2 } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryRequest, setDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  usePageTitle({ title: `Suivi de commande #${orderId?.substring(0, 8) || ''}` });

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
      // Subscribe to real-time updates
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

      return () => {
        supabase.removeChannel(orderSubscription);
      };
    }
  }, [orderId]);

  const fetchOrderData = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);

      // Fetch restaurant data
      if (data.restaurant_id) {
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', data.restaurant_id)
          .single();

        if (restaurantError) throw restaurantError;
        setRestaurant(restaurantData);
      }

      // Fetch delivery request if exists
      const { data: deliveryData, error: deliveryError } = await supabase
        .from('delivery_requests')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (!deliveryError) {
        setDeliveryRequest(deliveryData);
      }
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

  const shareTracking = () => {
    if (navigator.share) {
      navigator.share({
        title: `Suivi de commande #${orderId?.substring(0, 8)}`,
        text: `Suivez ma commande chez ${restaurant?.name} en temps réel!`,
        url: window.location.href
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: 'Lien copié',
            description: 'Le lien de suivi a été copié dans votre presse-papier',
          });
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'preparing': return 'En préparation';
      case 'prepared': return 'Prête';
      case 'delivering': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'prepared': return 'bg-indigo-100 text-indigo-800';
      case 'delivering': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isCancellable = () => {
    if (!order) return false;
    return ['pending', 'accepted'].includes(order.status);
  };

  const cancelOrder = async () => {
    if (!order || !isCancellable()) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: 'Annulée par le client'
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: 'Commande annulée',
        description: 'Votre commande a bien été annulée',
      });

      fetchOrderData();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'annuler la commande',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 py-8">
        <div className="flex justify-center">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container max-w-4xl mx-auto p-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
              <h3 className="mt-2 text-lg font-medium">{error || 'Commande non trouvée'}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                La commande que vous recherchez n'existe pas ou n'est plus disponible.
              </p>
              <Button asChild className="mt-4">
                <Link to="/orders">Voir mes commandes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <Button asChild variant="ghost" className="p-0 hover:bg-transparent">
            <Link to="/orders" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour aux commandes
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={shareTracking}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Commande #{order.id.substring(0, 8)}</CardTitle>
                <CardDescription>
                  {formatDate(order.created_at)}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-4">
              {/* Restaurant Info */}
              {restaurant && (
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {restaurant.logo_url ? (
                      <img 
                        src={restaurant.logo_url} 
                        alt={restaurant.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10">
                        <span className="text-lg font-bold text-primary/70">
                          {restaurant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                    <div className="flex space-x-2 mt-1">
                      {restaurant.phone && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs" 
                          onClick={() => window.location.href = `tel:${restaurant.phone}`}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Appeler
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        asChild
                      >
                        <Link to={`/restaurant/${restaurant.id}`}>
                          Voir le restaurant
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Progress */}
              <div className="py-2">
                <OrderProgress status={order.status} />
              </div>

              {/* Order Details Card */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Receipt className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Détails de la commande</span>
                  </div>
                  <Link to={`/order/${order.id}`} className="text-sm text-primary hover:underline">
                    Voir les détails
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">
                      {order.total_amount.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Paiement</span>
                    <span className="font-medium">
                      {order.payment_status === 'completed' ? 'Payé' : 'En attente'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Date</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Heure</span>
                    <span>
                      {new Date(order.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Adresse de livraison</p>
                  <p className="text-muted-foreground">{order.delivery_address}</p>
                  {order.delivery_instructions && (
                    <p className="text-sm italic mt-1">{order.delivery_instructions}</p>
                  )}
                </div>
              </div>

              {/* Cancel Button */}
              {isCancellable() && (
                <>
                  <Separator />
                  <div className="flex justify-center">
                    <Button 
                      variant="destructive"
                      onClick={cancelOrder}
                    >
                      Annuler la commande
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Tracking */}
        {(order.delivery_status !== 'pending' || deliveryRequest) && (
          <DeliveryTracking orderId={order.id} />
        )}
      </div>
    </div>
  );
}
