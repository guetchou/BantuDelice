
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Bike, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LiveTrackingProps {
  orderId: string;
}

const LiveTracking = ({ orderId }: LiveTrackingProps) => {
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        // Check if delivery exists
        const { data: deliveryData, error: deliveryError } = await supabase
          .from('delivery_requests')
          .select('status, driver_id')
          .eq('order_id', orderId)
          .single();

        if (deliveryError && deliveryError.code !== 'PGRST116') {
          throw deliveryError;
        }

        if (deliveryData) {
          setDeliveryStatus(deliveryData.status);

          // If there's a driver, fetch their info
          if (deliveryData.driver_id) {
            const { data: driverData, error: driverError } = await supabase
              .from('delivery_drivers')
              .select('name, phone, profile_picture, current_latitude, current_longitude')
              .eq('id', deliveryData.driver_id)
              .single();

            if (driverError) throw driverError;
            setDriverInfo(driverData);
          }
        }
      } catch (error) {
        console.error("Error fetching delivery tracking data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de livraison",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryInfo();
  }, [orderId, toast]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no delivery data exists yet
  if (!deliveryStatus) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suivi de la livraison</CardTitle>
      </CardHeader>
      <CardContent>
        {driverInfo ? (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Bike className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{driverInfo.name}</p>
              <p className="text-sm text-muted-foreground">{driverInfo.phone}</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p>Livreur en attente d'assignation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveTracking;
