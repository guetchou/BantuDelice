
export interface DeliveryDriver {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  vehicle_type: string; 
  vehicle_model: string;
  license_plate: string;
  photo_url: string;
  rating: number;
  is_available: boolean;
  current_latitude: number;
  current_longitude: number;
  last_active: string;
  total_deliveries: number;
  status: 'available' | 'busy' | 'offline';
  verified: boolean;
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
  type?: 'pickup' | 'dropoff' | 'driver' | 'customer';
  request_id?: string;
  is_priority?: boolean;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  driver_id?: string;
  pickup_address: string;
  delivery_address: string;
  status: DeliveryStatus;
  created_at: string;
  estimated_pickup_time?: string;
  estimated_delivery_time?: string;
  actual_pickup_time?: string;
  actual_delivery_time?: string;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  external_service_id?: string;
  cancelled_at?: string;
}

export type DeliveryStatus = 
  | 'pending'
  | 'accepted'
  | 'picked_up'
  | 'in_progress'
  | 'delivering'
  | 'delivered'
  | 'cancelled'
  | 'failed'
  | 'assigned'
  | 'in_transit';

export interface DeliverySettings {
  id: string;
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_fee: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  min_order_value: number;
  delivery_radius: number;
  delivery_fee_base: number;
  delivery_fee_per_km: number;
  delivery_time_estimate: number;
  auto_assign_drivers: boolean;
}
