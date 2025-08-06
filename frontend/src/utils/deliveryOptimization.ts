
import apiService from '@/services/api';
import { DeliveryDriver, DeliveryRequest } from '@/types/delivery';

// Calculate distance between two points using the Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Estimate delivery time based on distance and vehicle type
export const estimateDeliveryTime = (
  distance: number,
  vehicleType: string = 'bike'
): number => {
  // Average speeds in km/h
  const speeds: Record<string, number> = {
    bike: 15,
    scooter: 25,
    car: 35,
    walk: 5
  };
  
  // Get speed based on vehicle type or default to bike
  const speed = speeds[vehicleType] || speeds.bike;
  
  // Calculate time in minutes, adding a base of 10 minutes for pickup
  const timeInMinutes = Math.ceil((distance / speed) * 60) + 10;
  
  return timeInMinutes;
};

// Find the optimal driver for a delivery based on various factors
export const findOptimalDriver = async (
  restaurantLat: number,
  restaurantLng: number,
  deliveryLat: number,
  deliveryLng: number,
  isPriority: boolean = false
): Promise<DeliveryDriver | null> => {
  try {
    // Fetch available drivers
    const { data: drivers, error } = await supabase
      .from('delivery_drivers')
      .select('*')
      .eq('status', 'available');
      
    if (error) throw error;
    if (!drivers || drivers.length === 0) return null;
    
    // Calculate scores for each driver
    const scoredDrivers = drivers.map(driver => {
      // Calculate distance from restaurant to driver
      const distanceToRestaurant = calculateDistance(
        driver.current_latitude,
        driver.current_longitude,
        restaurantLat,
        restaurantLng
      );
      
      // Calculate total delivery distance
      const deliveryDistance = calculateDistance(
        restaurantLat,
        restaurantLng,
        deliveryLat,
        deliveryLng
      );
      
      // Estimate total time (driver to restaurant + restaurant to delivery)
      const estimatedTime = estimateDeliveryTime(distanceToRestaurant + deliveryDistance, driver.vehicle_type || 'bike');
      
      // Calculate a score (lower is better)
      // Factors: distance to restaurant, delivery rating, driver experience, current workload
      let score = distanceToRestaurant * 1.5; // Distance factor
      score -= driver.average_rating * 2; // Rating bonus (higher rating lowers score)
      score -= Math.min(driver.total_deliveries / 50, 5); // Experience bonus (up to 5 points)
      
      // Adjust score for priority deliveries (prefer higher-rated drivers)
      if (isPriority) {
        score -= driver.average_rating * 3;
      }
      
      return {
        ...driver,
        score,
        distance: distanceToRestaurant,
        estimated_time: estimatedTime
      };
    });
    
    // Sort by score (lower is better) and return the best driver
    scoredDrivers.sort((a, b) => a.score - b.score);
    
    if (scoredDrivers.length > 0) {
      return scoredDrivers[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error finding optimal driver:', error);
    return null;
  }
};

// Create a delivery request in the database
export const createDeliveryRequest = async (
  orderId: string,
  restaurantId: string,
  customerId: string,
  pickupAddress: string,
  deliveryAddress: string,
  deliveryFee: number,
  isPriority: boolean = false,
  specialInstructions?: string
): Promise<{ success: boolean, delivery_request_id?: string, error?: string }> => {
  try {
    // Get restaurant and delivery locations
    const { data: locations } = await supabase
      .from('orders')
      .select(`
        restaurants:restaurant_id (
          latitude,
          longitude,
          address
        ),
        delivery_latitude,
        delivery_longitude
      `)
      .eq('id', orderId)
      .single();
      
    if (!locations) {
      throw new Error('Could not find order locations');
    }
    
    const restaurantLat = locations.restaurants?.latitude || 0;
    const restaurantLng = locations.restaurants?.longitude || 0;
    const deliveryLat = locations.delivery_latitude || 0;
    const deliveryLng = locations.delivery_longitude || 0;
    
    // Calculate distance
    const distance = calculateDistance(
      restaurantLat,
      restaurantLng,
      deliveryLat,
      deliveryLng
    );
    
    // Create delivery request
    const { data: deliveryRequest, error } = await supabase
      .from('delivery_requests')
      .insert({
        order_id: orderId,
        restaurant_id: restaurantId,
        customer_id: customerId,
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        status: 'pending',
        distance: distance,
        estimated_duration: estimateDeliveryTime(distance),
        delivery_fee: deliveryFee,
        special_instructions: specialInstructions,
        is_priority: isPriority
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Update the order with delivery request info
    await supabase
      .from('orders')
      .update({
        delivery_status: 'requested',
        delivery_request_id: deliveryRequest.id
      })
      .eq('id', orderId);
    
    return {
      success: true,
      delivery_request_id: deliveryRequest.id
    };
  } catch (error) {
    console.error('Error creating delivery request:', error);
    return {
      success: false,
      error: 'Failed to create delivery request'
    };
  }
};

// Assign a driver to a delivery request
export const assignDriverToDelivery = async (
  deliveryRequestId: string,
  driverId: string,
  isExternalService: boolean = false
): Promise<{ success: boolean, error?: string }> => {
  try {
    // Update the delivery request
    const { error: requestError } = await supabase
      .from('delivery_requests')
      .update({
        assigned_driver_id: driverId,
        status: 'assigned',
        external_service_id: isExternalService ? driverId : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', deliveryRequestId);
      
    if (requestError) throw requestError;
    
    if (!isExternalService) {
      // Update the driver status
      const { error: driverError } = await supabase
        .from('delivery_drivers')
        .update({
          status: 'busy',
          current_order_id: deliveryRequestId,
          updated_at: new Date().toISOString()
        })
        .eq('id', driverId);
        
      if (driverError) throw driverError;
    }
    
    // Get the order_id from the request
    const { data: request } = await supabase
      .from('delivery_requests')
      .select('order_id')
      .eq('id', deliveryRequestId)
      .single();
      
    if (request) {
      // Update the order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          delivery_status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.order_id);
        
      if (orderError) throw orderError;
      
      // Create initial tracking entry
      const { error: trackingError } = await supabase
        .from('delivery_tracking')
        .insert({
          delivery_request_id: deliveryRequestId,
          order_id: request.order_id,
          driver_id: driverId,
          status: 'assigned',
          latitude: 0, // Will be updated when driver starts
          longitude: 0, // Will be updated when driver starts
        });
        
      if (trackingError) throw trackingError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error assigning driver:', error);
    return {
      success: false,
      error: 'Failed to assign driver'
    };
  }
};
