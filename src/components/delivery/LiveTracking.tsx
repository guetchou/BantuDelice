import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DeliveryMap from "@/components/DeliveryMap";

interface DeliveryStatus {
  id: string;
  order_id: string;
  status: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

interface LiveTrackingProps {
  orderId: string;
}

const LiveTracking = ({ orderId }: LiveTrackingProps) => {
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeliveryStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("delivery_tracking")
          .select("*")
          .eq("order_id", orderId)
          .single();

        if (error) throw error;
        setDeliveryStatus(data);
      } catch (error) {
        console.error("Error fetching delivery status:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le statut de la livraison",
          variant: "destructive",
        });
      }
    };

    fetchDeliveryStatus();

    // Abonnement aux mises à jour en temps réel
    const channel = supabase
      .channel('delivery-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_tracking',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('Mise à jour de la livraison:', payload);
          setDeliveryStatus(payload.new as DeliveryStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, toast]);

  if (!deliveryStatus) {
    return <div>Chargement du suivi de livraison...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Statut de la livraison</h3>
        <p className="text-gray-600">
          {deliveryStatus.status === 'en_route' ? 'En route' : 
           deliveryStatus.status === 'livré' ? 'Livré' : 'En préparation'}
        </p>
        <p className="text-sm text-gray-500">
          Dernière mise à jour: {new Date(deliveryStatus.updated_at).toLocaleTimeString()}
        </p>
      </div>

      <div className="h-[400px] rounded-lg overflow-hidden">
        <DeliveryMap 
          latitude={deliveryStatus.latitude} 
          longitude={deliveryStatus.longitude} 
        />
      </div>
    </div>
  );
};

export default LiveTracking;