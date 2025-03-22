
export interface DeliveryRequest {
  id: string;
  driver_id?: string;
  order_id: string;
  restaurant_id: string;
  customer_id: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'failed';
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  created_at: string;
  updated_at: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  delivery_notes?: string;
  type?: 'pickup' | 'dropoff';
  request_id?: string;
  is_priority?: boolean;
}

export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_type: 'bike' | 'car' | 'scooter' | 'walk';
  license_plate?: string;
  status: 'available' | 'busy' | 'offline';
  last_location_latitude?: number;
  last_location_longitude?: number;
  last_active?: string;
  rating?: number;
  total_deliveries?: number;
  profile_image_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
}

export interface DeliverySettings {
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_fee: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  estimated_preparation_time: number;
  estimated_delivery_time: number;
  delivery_hours: string[];
  auto_assign_drivers: boolean;
  auto_assign: boolean;
  max_distance: number;
  external_service_enabled: boolean;
  service_fee_percentage: number;
}

export interface DeliveryRating {
  id: string;
  delivery_id: string;
  customer_id: string;
  driver_id: string;
  order_id: string;
  rating: number;
  feedback?: string;
  created_at: string;
}

export interface DeliveryStats {
  totalDeliveries: number;
  totalEarnings: number;
  activeDrivers: number;
  ordersInProgress: number;
  averageTime: number;
  availableZones: number;
  balance: number;
  completionRate: number;
}
