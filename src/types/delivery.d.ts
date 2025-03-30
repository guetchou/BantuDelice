
export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_type: 'motorcycle' | 'bicycle' | 'scooter' | 'car';
  current_latitude: number;
  current_longitude: number;
  current_location?: string;
  status: string;
  is_available: boolean;
  profile_picture?: string;
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  commission_rate: number;
  created_at: string;
  last_location_update: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  languages?: string[];
  years_experience?: number;
  distance?: number;
  is_external?: boolean;
  current_deliveries?: number;
  max_concurrent_deliveries?: number;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  status: DeliveryStatus;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  assigned_driver_id?: string;
  requested_at: string;
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  delivery_fee: number;
  is_external: boolean;
  external_service_id?: string;
  notes?: string;
  priority: 'normal' | 'high' | 'rush';
  estimated_distance: number;
  estimated_duration: number;
  delivery_time?: string;
  delivery_instructions?: string;
  pickup_time?: string;
  distance_km?: number;
  delivery_type: 'standard' | 'express' | 'scheduled';
  created_at: string;
  is_priority?: boolean;
  distance?: number;
}

export type DeliveryStatus = 
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'cancelled'
  | 'delivering';

export interface DeliverySettings {
  id?: string;
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_fee: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  delivery_radius: number;
  delivery_time_estimate: number;
  delivery_buffer_time: number;
  priority_delivery_fee: number;
  estimated_preparation_time: number;
  auto_assign: boolean;
  max_distance: number;
  auto_assign_drivers: boolean;
  created_at?: string;
  updated_at?: string;
  estimated_delivery_time?: number;
  accepted_external_services?: string[];
  auto_accept_orders?: boolean;
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  request_id?: string;
  type?: 'pickup' | 'dropoff' | 'driver'; 
  is_priority?: boolean;
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  optimized_waypoints: DeliveryLocation[];
  estimated_duration: number;
  estimated_distance: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  start_time?: string;
  estimated_end_time?: string;
  waypoints?: DeliveryLocation[];
  delivery_requests?: string[];
  total_distance?: number;
}

export interface DeliveryMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_type: "driver" | "customer";
  message: string;
  read: boolean;
  created_at: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  logo_url?: string;
  api_key?: string;
  is_active: boolean;
  base_fee: number;
  price_per_km: number;
  service_area?: any;
  created_at: string;
  updated_at?: string;
}

export type DeliveryType = 'restaurant' | 'external' | 'platform';
