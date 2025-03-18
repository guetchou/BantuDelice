
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver } from '@/types/delivery';
import { toast } from '@/components/ui/use-toast';

interface OrderLocation {
  id: string;
  delivery_address: string;
  latitude: number;
  longitude: number;
  total_amount: number;
}

const MAX_DRIVER_DISTANCE_KM = 10; // Max distance to consider driver in km

// Calculate distance between two points using Haversine formula
function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

export async function findOptimalDriver(order: OrderLocation): Promise<DeliveryDriver | null> {
  try {
    // Fetch all available drivers
    const { data: drivers, error } = await supabase
      .from('delivery_drivers')
      .select('*')
      .eq('is_available', true)
      .eq('status', 'available');
      
    if (error) throw error;
    
    if (!drivers || drivers.length === 0) {
      return null;
    }
    
    // Calculate distance for each driver to the restaurant
    // In a real app, this would be more complex, considering traffic, driver ratings, etc.
    const driversWithScore = drivers.map((driver: DeliveryDriver) => {
      // Distance to the order
      const distance = getDistanceInKm(
        driver.current_latitude,
        driver.current_longitude,
        order.latitude,
        order.longitude
      );
      
      // Simple scoring - closer is better, but also consider rating
      // A higher rating means the driver gets a bonus
      const ratingBonus = driver.average_rating ? (driver.average_rating - 3) * 2 : 0;
      
      // Lower score is better
      const score = distance - ratingBonus;
      
      return {
        ...driver,
        distance,
        score
      };
    });
    
    // Filter out drivers too far away
    const nearbyDrivers = driversWithScore.filter(d => d.distance <= MAX_DRIVER_DISTANCE_KM);
    
    if (nearbyDrivers.length === 0) {
      return null;
    }
    
    // Sort by score (lower is better)
    nearbyDrivers.sort((a, b) => a.score - b.score);
    
    // Return the best match
    return nearbyDrivers[0];
  } catch (err) {
    console.error('Error finding optimal driver:', err);
    return null;
  }
}

export async function createDeliveryRequest(
  orderId: string, 
  restaurantId: string,
  restaurant: { latitude: number, longitude: number },
  delivery: { address: string, latitude: number, longitude: number },
  driverId?: string
): Promise<string | null> {
  try {
    // Calculate distance and estimated time
    const distanceKm = getDistanceInKm(
      restaurant.latitude,
      restaurant.longitude,
      delivery.latitude,
      delivery.longitude
    );
    
    // Assume average speed of 30 km/h for urban delivery
    const estimatedMinutes = Math.round((distanceKm / 30) * 60);
    
    const { data, error } = await supabase
      .from('delivery_requests')
      .insert({
        order_id: orderId,
        restaurant_id: restaurantId,
        status: driverId ? 'assigned' : 'pending',
        assigned_driver_id: driverId || null,
        pickup_address: 'Restaurant address', // Would come from restaurant in real app
        pickup_latitude: restaurant.latitude,
        pickup_longitude: restaurant.longitude,
        delivery_address: delivery.address,
        delivery_latitude: delivery.latitude,
        delivery_longitude: delivery.longitude,
        requested_at: new Date().toISOString(),
        accepted_at: driverId ? new Date().toISOString() : null,
        estimated_distance: distanceKm,
        estimated_duration: estimatedMinutes,
        delivery_fee: 1500 + (distanceKm * 300), // Base fee + per km
        is_external: false
      })
      .select()
      .single();
      
    if (error) throw error;
    
    if (driverId) {
      // Update driver status
      await supabase
        .from('delivery_drivers')
        .update({
          is_available: false,
          status: 'busy',
          current_order_id: orderId
        })
        .eq('id', driverId);
        
      // Create initial tracking entry
      await supabase
        .from('delivery_tracking')
        .insert({
          delivery_request_id: data.id,
          order_id: orderId,
          driver_id: driverId,
          status: 'assigned',
          latitude: restaurant.latitude,
          longitude: restaurant.longitude
        });
    }
    
    return data.id;
  } catch (err) {
    console.error('Error creating delivery request:', err);
    toast({
      title: 'Error',
      description: 'Failed to create delivery request',
      variant: 'destructive',
    });
    return null;
  }
}
