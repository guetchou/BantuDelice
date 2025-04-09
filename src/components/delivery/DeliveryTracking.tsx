import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, MapPin, Clock, AlertTriangle, PackageCheck, User, Store } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";
import DeliveryChat from './DeliveryChat';
import DeliveryOrderComplete from './DeliveryOrderComplete';
import DeliveryDriverMap from './DeliveryDriverMap';
import { useAuth } from '@/hooks/useAuth';

interface DeliveryRequest {
  id: string;
  restaurant_id: string;
  customer_id: string;
  driver_id: string | null;
  pickup_address: string;
  delivery_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_latitude: number;
  delivery_longitude: number;
  status: string;
  created_at: string;
  updated_at: string;
  order_total: number;
  customer_name: string;
  customer_phone: string;
  restaurant_name: string;
  restaurant_phone: string;
  restaurant_address: string;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  delivery_fee: number;
}

const DeliveryTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [delivery, setDelivery] = useState<DeliveryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDriver, setIsDriver] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from('delivery_requests')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;

        if (data) {
          setDelivery(data);
          setRestaurantId(data.restaurant_id);
        }
      } catch (error) {
        console.error('Error fetching delivery:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de livraison",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [orderId, toast]);

  useEffect(() => {
    const checkDriverStatus = async () => {
      if (!user?.id) return;
      
      try {
        const { data: driverData, error: driverError } = await supabase
          .from('delivery_drivers')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (driverError) {
          // If no driver profile, assume it's not a driver
          setIsDriver(false);
        } else {
          // If driver profile exists, confirm it's a driver
          setIsDriver(true);
        }
      } catch (error) {
        console.error('Error checking driver status:', error);
        setIsDriver(false);
      }
    };
    
    checkDriverStatus();
  }, [user?.id]);

  const handleAcceptDelivery = async () => {
    if (!orderId || !user?.id) return;

    try {
      const { error } = await supabase
        .from('delivery_requests')
        .update({ driver_id: user.id, status: 'assigned' })
        .eq('id', orderId);

      if (error) throw error;

      setDelivery(prevDelivery => prevDelivery ? { ...prevDelivery, driver_id: user.id, status: 'assigned' } : null);
      toast({
        title: "Livraison acceptée",
        description: "Vous avez accepté cette livraison",
      });
    } catch (error) {
      console.error('Error accepting delivery:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter cette livraison",
        variant: "destructive",
      });
    }
  };

  const handlePickupOrder = async () => {
    if (!orderId) return;

    try {
      const { error } = await supabase
        .from('delivery_requests')
        .update({ status: 'picked_up' })
        .eq('id', orderId);

      if (error) throw error;

      setDelivery(prevDelivery => prevDelivery ? { ...prevDelivery, status: 'picked_up' } : null);
      toast({
        title: "Commande récupérée",
        description: "Vous avez récupéré la commande",
      });
    } catch (error) {
      console.error('Error picking up order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
        variant: "destructive",
      });
    }
  };

  const handleStartDelivery = async () => {
    if (!orderId) return;

    try {
      const { error } = await supabase
        .from('delivery_requests')
        .update({ status: 'delivering' })
        .eq('id', orderId);

      if (error) throw error;

      setDelivery(prevDelivery => prevDelivery ? { ...prevDelivery, status: 'delivering' } : null);
      toast({
        title: "Livraison en cours",
        description: "Vous avez commencé la livraison",
      });
    } catch (error) {
      console.error('Error starting delivery:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la livraison",
        variant: "destructive",
      });
    }
  };

  const handleCompleteDelivery = async () => {
    if (!orderId) return;

    try {
      const { error } = await supabase
        .from('delivery_requests')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) throw error;

      setDelivery(prevDelivery => prevDelivery ? { ...prevDelivery, status: 'completed' } : null);
      toast({
        title: "Livraison terminée",
        description: "Vous avez terminé la livraison",
      });
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la livraison",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-4 h-4 mr-2" /> En attente</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="text-blue-500 border-blue-500"><Truck className="w-4 h-4 mr-2" /> Assignée</Badge>;
      case 'picked_up':
        return <Badge variant="outline" className="text-orange-500 border-orange-500"><PackageCheck className="w-4 h-4 mr-2" /> Récupérée</Badge>;
      case 'delivering':
        return <Badge variant="outline" className="text-purple-500 border-purple-500"><Truck className="w-4 h-4 mr-2" /> En livraison</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500"><CheckCircle className="w-4 h-4 mr-2" /> Terminée</Badge>;
      default:
        return <Badge variant="destructive"><AlertTriangle className="w-4 h-4 mr-2" /> Inconnue</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des informations de livraison...</div>;
  }

  if (!delivery) {
    return <div className="text-center py-8">Livraison non trouvée.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Suivi de la Livraison #{delivery.id.substring(0, 8)}</CardTitle>
          <CardDescription>
            Suivez l'état de votre livraison en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations de Livraison</h3>
              <div className="space-y-2">
                <p>
                  <Store className="w-4 h-4 inline-block mr-1" /> Restaurant: {delivery.restaurant_name}
                </p>
                <p>
                  <MapPin className="w-4 h-4 inline-block mr-1" /> Adresse de ramassage: {delivery.pickup_address}
                </p>
                <p>
                  <User className="w-4 h-4 inline-block mr-1" /> Client: {delivery.customer_name}
                </p>
                <p>
                  <MapPin className="w-4 h-4 inline-block mr-1" /> Adresse de livraison: {delivery.dropoff_address}
                </p>
                <p>
                  <Clock className="w-4 h-4 inline-block mr-1" /> Date de création: {new Date(delivery.created_at).toLocaleDateString()}
                </p>
                <p>
                  <Clock className="w-4 h-4 inline-block mr-1" /> Dernière mise à jour: {new Date(delivery.updated_at).toLocaleTimeString()}
                </p>
                <p>
                  <Truck className="w-4 h-4 inline-block mr-1" /> Statut: {getStatusBadge(delivery.status)}
                </p>
                <p>
                  <span className="font-semibold">Total de la commande:</span> {formatCurrency(delivery.order_total)}
                </p>
                {delivery.delivery_fee && (
                  <p>
                    <span className="font-semibold">Frais de livraison:</span> {formatCurrency(delivery.delivery_fee)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Carte de Livraison</h3>
              <div className="rounded-lg overflow-hidden">
                <DeliveryDriverMap restaurantId={delivery.restaurant_id} deliveryId={delivery.id} height="300px" />
              </div>
            </div>
          </div>

          {isDriver && delivery.driver_id === user?.id && delivery.status !== 'completed' && (
            <div className="flex justify-center gap-4">
              {delivery.status === 'assigned' && (
                <Button onClick={handlePickupOrder}>Récupérer la commande</Button>
              )}
              {delivery.status === 'picked_up' && (
                <Button onClick={handleStartDelivery}>Commencer la livraison</Button>
              )}
              {delivery.status === 'delivering' && (
                <Button onClick={handleCompleteDelivery}>Terminer la livraison</Button>
              )}
            </div>
          )}

          {!isDriver && delivery.status !== 'completed' && (
            <div className="text-center">
              <p>
                <Truck className="w-4 h-4 inline-block mr-1" /> Votre commande est {delivery.status}.
                {delivery.driver_id && (
                  <span> Un livreur a été assigné à votre commande.</span>
                )}
              </p>
            </div>
          )}

          {delivery.status === 'completed' && (
            <div className="text-center">
              <p>
                <CheckCircle className="w-4 h-4 inline-block mr-1" /> Votre commande a été livrée. Merci!
              </p>
            </div>
          )}

          <h3 className="text-lg font-semibold mb-2">Chat</h3>
          <DeliveryChat orderId={orderId} userType={isDriver ? 'driver' : 'customer'} />

          {delivery.status === 'completed' && restaurantId && (
            <DeliveryOrderComplete orderId={orderId} restaurantId={restaurantId} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryTracking;
