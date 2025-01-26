import { supabase } from '@/integrations/supabase/client';

interface DeliveryDriver {
  id: string;
  current_latitude: number;
  current_longitude: number;
  total_deliveries: number;
  average_rating: number;
}

interface Order {
  id: string;
  delivery_address: string;
  latitude: number;
  longitude: number;
  total_amount: number;
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const findOptimalDriver = async (order: Order): Promise<DeliveryDriver | null> => {
  // Récupérer tous les livreurs disponibles
  const { data: drivers } = await supabase
    .from('delivery_drivers')
    .select('*')
    .eq('status', 'available');

  if (!drivers || drivers.length === 0) return null;

  // Calculer un score pour chaque livreur basé sur:
  // - Distance par rapport à la commande
  // - Note moyenne
  // - Nombre de livraisons effectuées
  const driversWithScores = drivers.map(driver => {
    const distance = calculateDistance(
      driver.current_latitude,
      driver.current_longitude,
      order.latitude,
      order.longitude
    );

    const score = 
      (1 / distance) * 0.5 + // Distance (50% du score)
      (driver.average_rating / 5) * 0.3 + // Note (30% du score)
      (Math.min(driver.total_deliveries, 100) / 100) * 0.2; // Expérience (20% du score)

    return { ...driver, score };
  });

  // Retourner le livreur avec le meilleur score
  return driversWithScores.reduce((best, current) => 
    current.score > (best?.score || 0) ? current : best
  , null);
};