import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { findOptimalDriver } from '@/utils/deliveryOptimization';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryAssignmentProps {
  orderId: string;
  restaurantLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryAddress: string;
}

const DeliveryAssignment = ({ 
  orderId,
  restaurantLocation,
  deliveryAddress 
}: DeliveryAssignmentProps) => {
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAssignment = async () => {
      const { data } = await supabase
        .from('delivery_tracking')
        .select('delivery_user_id')
        .eq('order_id', orderId)
        .single();

      setAssigned(!!data?.delivery_user_id);
    };

    checkAssignment();
  }, [orderId]);

  const handleAssignment = async () => {
    setLoading(true);
    try {
      const optimalDriver = await findOptimalDriver({
        id: orderId,
        delivery_address: deliveryAddress,
        latitude: restaurantLocation.latitude + 0.01,
        longitude: restaurantLocation.longitude + 0.01,
        total_amount: 0
      });

      if (!optimalDriver) {
        throw new Error('Aucun livreur disponible');
      }

      // Créer l'enregistrement de suivi
      const { error } = await supabase
        .from('delivery_tracking')
        .insert({
          order_id: orderId,
          delivery_user_id: optimalDriver.id,
          status: 'assigned',
          latitude: optimalDriver.current_latitude,
          longitude: optimalDriver.current_longitude
        });

      if (error) throw error;

      setAssigned(true);
      toast({
        title: "Livreur assigné",
        description: "Un livreur a été assigné à votre commande",
      });
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner un livreur pour le moment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (assigned) {
    return (
      <Card className="p-6">
        <p className="text-green-600 font-medium">
          Un livreur a été assigné à votre commande
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Assignation du livreur</h2>
      <p className="mb-4">
        Nous allons assigner le meilleur livreur disponible pour votre commande
      </p>
      <Button
        className="w-full"
        onClick={handleAssignment}
        disabled={loading}
      >
        {loading ? "Recherche en cours..." : "Rechercher un livreur"}
      </Button>
    </Card>
  );
};

export default DeliveryAssignment;