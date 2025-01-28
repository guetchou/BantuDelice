import { supabase } from "@/integrations/supabase/client";

interface DeliveryDriver {
  id: string;
  current_latitude: number;
  current_longitude: number;
  status: string;
}

interface OrderLocation {
  id: string;
  delivery_address: string;
  latitude: number;
  longitude: number;
  total_amount: number;
}

export const findOptimalDriver = async (order: OrderLocation): Promise<DeliveryDriver | null> => {
  try {
    console.log('Finding optimal driver for order:', order);

    const { data: availableDrivers, error } = await supabase
      .from('delivery_drivers')
      .select('*')
      .eq('status', 'available');

    if (error) {
      console.error('Error fetching drivers:', error);
      return null;
    }

    if (!availableDrivers || availableDrivers.length === 0) {
      console.log('No available drivers found');
      return null;
    }

    // Simple algorithm: find closest driver based on straight-line distance
    let closestDriver = availableDrivers[0];
    let shortestDistance = calculateDistance(
      order.latitude,
      order.longitude,
      closestDriver.current_latitude,
      closestDriver.current_longitude
    );

    availableDrivers.forEach(driver => {
      const distance = calculateDistance(
        order.latitude,
        order.longitude,
        driver.current_latitude,
        driver.current_longitude
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestDriver = driver;
      }
    });

    return closestDriver;
  } catch (error) {
    console.error('Error in findOptimalDriver:', error);
    return null;
  }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}