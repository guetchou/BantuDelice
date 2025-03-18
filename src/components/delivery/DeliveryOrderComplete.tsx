
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DeliveryDriverRating from './DeliveryDriverRating';
import DeliveryRating from './DeliveryRating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, User } from 'lucide-react';

interface DeliveryOrderCompleteProps {
  orderId: string;
  restaurantId: string;
}

const DeliveryOrderComplete = ({ orderId, restaurantId }: DeliveryOrderCompleteProps) => {
  const [deliveryRequest, setDeliveryRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRatedDelivery, setHasRatedDelivery] = useState(false);
  const [hasRatedDriver, setHasRatedDriver] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeliveryRequest = async () => {
      try {
        setLoading(true);
        
        // Récupérer la demande de livraison
        const { data: requestData, error: requestError } = await supabase
          .from('delivery_requests')
          .select('*')
          .eq('order_id', orderId)
          .single();
          
        if (requestError && requestError.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération de la demande de livraison:', requestError);
          return;
        }
        
        setDeliveryRequest(requestData);
        
        // Vérifier si l'utilisateur a déjà évalué la livraison
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && requestData) {
          // Vérifier notation restaurant
          const { data: restaurantRating } = await supabase
            .from('detailed_restaurant_reviews')
            .select('id')
            .eq('order_id', orderId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          setHasRatedDelivery(!!restaurantRating);
          
          // Vérifier notation livreur
          if (requestData.assigned_driver_id) {
            const { data: driverRating } = await supabase
              .from('delivery_driver_ratings')
              .select('id')
              .eq('order_id', orderId)
              .eq('user_id', user.id)
              .eq('driver_id', requestData.assigned_driver_id)
              .maybeSingle();
              
            setHasRatedDriver(!!driverRating);
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les informations de livraison',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchDeliveryRequest();
    }
  }, [orderId, toast]);

  const handleRatingSubmitted = () => {
    setHasRatedDelivery(true);
  };
  
  const handleDriverRatingSubmitted = () => {
    setHasRatedDriver(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Chargement des informations...</p>
        </CardContent>
      </Card>
    );
  }

  // Si pas de livraison trouvée
  if (!deliveryRequest) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évaluez votre expérience</CardTitle>
        <CardDescription>
          Votre avis nous aide à améliorer nos services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="restaurant">
          <TabsList className="w-full">
            <TabsTrigger value="restaurant" className="flex-1">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Restaurant
            </TabsTrigger>
            {deliveryRequest.assigned_driver_id && (
              <TabsTrigger value="driver" className="flex-1">
                <User className="w-4 h-4 mr-2" />
                Livreur
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="restaurant" className="pt-4">
            {hasRatedDelivery ? (
              <div className="text-center py-6">
                <p className="text-green-600 font-medium">
                  Merci d'avoir évalué le restaurant !
                </p>
              </div>
            ) : (
              <DeliveryRating 
                orderId={orderId} 
                restaurantId={restaurantId}
                onRatingSubmitted={handleRatingSubmitted}
              />
            )}
          </TabsContent>
          
          {deliveryRequest.assigned_driver_id && (
            <TabsContent value="driver" className="pt-4">
              {hasRatedDriver ? (
                <div className="text-center py-6">
                  <p className="text-green-600 font-medium">
                    Merci d'avoir évalué le livreur !
                  </p>
                </div>
              ) : (
                <DeliveryDriverRating
                  deliveryId={deliveryRequest.id}
                  orderId={orderId}
                  driverId={deliveryRequest.assigned_driver_id}
                  onRatingSubmitted={handleDriverRatingSubmitted}
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeliveryOrderComplete;
