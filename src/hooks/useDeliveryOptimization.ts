
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryMetrics {
  averageTime: number;
  peakHours: string[];
  optimalZones: Array<{
    id: string;
    score: number;
    estimatedTime: number;
  }>;
}

export const useDeliveryOptimization = (restaurantId: string) => {
  return useQuery({
    queryKey: ['deliveryOptimization', restaurantId],
    queryFn: async () => {
      // Récupération des données historiques de livraison
      const { data: deliveries, error: deliveriesError } = await supabase
        .from('order_tracking_details')
        .select(`
          *,
          orders(
            delivery_address,
            created_at,
            estimated_preparation_time,
            actual_preparation_time
          )
        `)
        .eq('status', 'delivered');

      if (deliveriesError) throw deliveriesError;

      // Calcul des métriques de base
      const metrics: DeliveryMetrics = {
        averageTime: 0,
        peakHours: [],
        optimalZones: []
      };

      if (!deliveries?.length) return metrics;

      // Analyse des temps de livraison moyens
      const deliveryTimes = deliveries.map(delivery => {
        const startTime = new Date(delivery.orders.created_at);
        const endTime = new Date(delivery.updated_at);
        return endTime.getTime() - startTime.getTime();
      });

      metrics.averageTime = deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length;

      // Identification des heures de pointe
      const hourCounts: Record<number, number> = {};
      deliveries.forEach(delivery => {
        const hour = new Date(delivery.orders.created_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      metrics.peakHours = Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => `${hour}:00`);

      // Calcul des zones optimales
      const { data: zones } = await supabase
        .from('delivery_zones')
        .select('*');

      if (zones) {
        metrics.optimalZones = zones.map(zone => {
          // Calcul du score basé sur plusieurs facteurs
          const zoneDeliveries = deliveries.filter(d => 
            isPointInPolygon(d.orders.delivery_address, zone.coordinates)
          );

          const successRate = zoneDeliveries.length > 0 
            ? zoneDeliveries.filter(d => d.status === 'delivered').length / zoneDeliveries.length 
            : 0;

          const avgDeliveryTime = zoneDeliveries.length > 0
            ? zoneDeliveries.reduce((acc, d) => {
                const time = new Date(d.updated_at).getTime() - new Date(d.created_at).getTime();
                return acc + time;
              }, 0) / zoneDeliveries.length
            : metrics.averageTime;

          return {
            id: zone.id,
            score: calculateZoneScore(successRate, avgDeliveryTime, zone.base_delivery_fee),
            estimatedTime: avgDeliveryTime
          };
        });
      }

      return metrics;
    },
    meta: {
      errorMessage: "Impossible d'optimiser les zones de livraison"
    }
  });
};

// Fonction utilitaire pour vérifier si un point est dans un polygone
const isPointInPolygon = (point: string, polygon: any): boolean => {
  // Implémentation de l'algorithme ray-casting
  // Pour simplifier, nous supposons que le point est dans le polygone
  return true;
};

// Calcul du score d'une zone basé sur plusieurs facteurs
const calculateZoneScore = (
  successRate: number,
  avgDeliveryTime: number,
  baseFee: number
): number => {
  // Normalisation des facteurs
  const timeScore = Math.max(0, 1 - (avgDeliveryTime / (60 * 60 * 1000))); // Score basé sur le temps (max 1h)
  const feeScore = Math.max(0, 1 - (baseFee / 5000)); // Score basé sur les frais (max 5000)
  
  // Pondération des facteurs
  return (successRate * 0.5) + (timeScore * 0.3) + (feeScore * 0.2);
};
