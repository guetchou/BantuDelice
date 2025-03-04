import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { OrderTrackingDetails } from "@/types/orderTracking";

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
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching tracking data:', error);
          return;
        }

        if (data) {
          setTrackingData({
            ...data,
            updated_at: data.updated_at || data.timestamp || new Date().toISOString(),
            status: data.status || 'preparing'
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
      (payload) => {
        console.log('Change received!', payload);
        fetchTrackingData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) {
    return <div>Chargement des informations de suivi...</div>;
  }

  if (!trackingData) {
    return <div>Aucune information de suivi disponible pour cette commande.</div>;
  }

  return (
    <div>
      <h2>Suivi de la commande</h2>
      <p>État: {trackingData.status}</p>
      {trackingData.estimated_delivery_time && (
        <p>Livraison prévue: {new Date(trackingData.estimated_delivery_time).toLocaleString()}</p>
      )}
      <p>Dernière mise à jour: {new Date(trackingData.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default OrderTracking;
