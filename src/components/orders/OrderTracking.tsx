
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { OrderTrackingDetails } from "@/types/orderTracking";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Clock, Truck, CheckCircle } from "lucide-react";

interface OrderTrackingProps {
  orderId: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const [trackingData, setTrackingData] = useState<OrderTrackingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingData = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from('order_tracking_details')
          .select('*')
          .eq('order_id', orderId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching tracking data:', error);
          return;
        }

        if (data) {
          // Handle potential undefined estimated delivery time
          const estimatedDeliveryTime = data.estimated_delivery_time || 
                                        data.estimated_completion_time || 
                                        new Date(Date.now() + 30 * 60000).toISOString(); // Default: 30 minutes from now
          
          setTrackingData({
            id: data.id,
            order_id: data.order_id,
            status: data.status as OrderTrackingDetails['status'],
            timestamp: data.timestamp,
            updated_at: data.timestamp,
            estimated_delivery_time: estimatedDeliveryTime,
            location_data: data.location_data || null,
            notes: data.notes || '',
            handled_by: data.handled_by || ''
          });
        }
      } catch (error) {
        console.error('Error in tracking data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();

    const channel = supabase
      .channel(`order_tracking:${orderId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'order_tracking_details', 
        filter: `order_id=eq.${orderId}`
      }, 
      () => {
        fetchTrackingData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) {
    return <div>Chargement du suivi de commande...</div>;
  }

  if (!trackingData) {
    return <div>Aucune information de suivi disponible.</div>;
  }

  const getProgress = () => {
    const statusMap: Record<OrderTrackingDetails['status'], number> = {
      'preparing': 25,
      'ready': 50,
      'picked_up': 75,
      'delivering': 90,
      'delivered': 100
    };
    return statusMap[trackingData.status] || 0;
  };

  const getStatusLabel = () => {
    const statusLabels: Record<OrderTrackingDetails['status'], string> = {
      'preparing': 'En préparation',
      'ready': 'Prête',
      'picked_up': 'En route',
      'delivering': 'En livraison',
      'delivered': 'Livrée'
    };
    return statusLabels[trackingData.status] || trackingData.status;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Suivi de commande</h2>
          <Clock className="h-6 w-6 text-gray-400" />
        </div>

        <Progress value={getProgress()} className="h-2" />

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            {trackingData.status === 'delivered' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Truck className="h-5 w-5 text-orange-500 animate-pulse" />
            )}
            <span>{getStatusLabel()}</span>
          </div>
          
          {trackingData.estimated_delivery_time && (
            <div>
              Livraison estimée: {new Date(trackingData.estimated_delivery_time).toLocaleTimeString()}
            </div>
          )}
        </div>

        {trackingData.notes && (
          <p className="text-sm text-gray-500">{trackingData.notes}</p>
        )}
      </div>
    </Card>
  );
};

export default OrderTracking;
