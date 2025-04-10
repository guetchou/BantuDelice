
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
  current_deliveries?: number;
  max_concurrent_deliveries?: number;
  profile_picture?: string;
  average_rating?: number;
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
  
  // Propriétés étendues
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_latitude?: number;
  delivery_longitude?: number;
  is_priority?: boolean;
  is_external?: boolean;
  requested_at?: string;
  accepted_at?: string;
  completed_at?: string;
  distance?: number;
  estimated_duration?: number;
  delivery_fee?: number;
  restaurant_id?: string;
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
  
  // Propriétés étendues
  estimated_delivery_time?: number;
  accepted_external_services?: string[];
  auto_accept_orders?: boolean;
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  delivery_requests: string[];
  status: 'active' | 'completed' | 'cancelled';
  start_time: string;
  estimated_end_time: string;
  actual_end_time?: string;
  total_distance?: number;
  total_duration?: number;
  waypoints?: any[];
  created_at: string;
  updated_at: string;
}

export interface DeliveryMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_type: 'driver' | 'customer';
  message: string;
  read: boolean;
  created_at: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  api_key?: string;
  status: 'active' | 'inactive';
  integration_type: string;
  base_url?: string;
  logo_url?: string;
  delivery_fee_override?: number;
  priority?: number;
}
