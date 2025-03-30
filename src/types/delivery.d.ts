
export type DeliveryStatus = 
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'picked_up'
  | 'delivering'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'failed';

export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  profile_picture?: string;
  current_latitude?: number;
  current_longitude?: number;
  vehicle_type: 'car' | 'motorcycle' | 'bicycle' | 'scooter';
  status: 'available' | 'busy' | 'offline' | 'on_break';
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  commission_rate: number;
  is_available: boolean;
  is_external?: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at?: string;
  last_location_update: string;
  current_location?: [number, number];
  distance?: number;
  current_deliveries?: number;
  max_concurrent_deliveries?: number;
  license_plate?: string;
  vehicle_model?: string;
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  request_id?: string;
  type?: 'pickup' | 'dropoff';
  is_priority?: boolean;
}

export interface DeliveryMessage {
  id: string;
  order_id: string;
  delivery_id?: string;
  sender_id: string;
  sender_type: 'driver' | 'customer';
  message: string;
  read: boolean;
  created_at: string;
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
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimated_distance?: number;
  estimated_duration?: number;
  delivery_time?: string;
  delivery_instructions?: string;
  pickup_time?: string;
  distance_km?: number;
  distance?: number;
  delivery_type?: 'standard' | 'express' | 'scheduled' | 'restaurant';
  created_at: string;
}

export interface DeliveryTracking {
  id: string;
  order_id: string;
  delivery_user_id?: string;
  latitude?: number;
  longitude?: number;
  status: DeliveryStatus;
  picked_up_at?: string;
  delivered_at?: string;
  updated_at: string;
  timestamp?: string;
}

export interface DeliverySettings {
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_fee: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  priority_delivery_fee: number;
  external_service_id?: string;
  estimated_preparation_time: number;
  auto_assign: boolean;
  auto_assign_drivers: boolean;
  max_distance: number;
  external_service_enabled: boolean;
  service_fee_percentage: number;
  estimated_delivery_time?: number;
  accepted_external_services?: string[];
  auto_accept_orders?: boolean;
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  stops: {
    id: string;
    order_id: string;
    type: 'pickup' | 'dropoff';
    address: string;
    latitude: number;
    longitude: number;
    sequence: number;
    estimated_arrival_time: string;
    status: 'pending' | 'arrived' | 'completed';
  }[];
  started_at?: string;
  completed_at?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  delivery_requests?: string[];
  waypoints?: DeliveryLocation[];
  total_distance?: number;
  start_time?: string;
  estimated_end_time?: string;
}

export interface DeliveryWallet {
  id: string;
  driver_id: string;
  balance: number;
  total_earnings: number;
  updated_at: string;
  created_at: string;
}

export interface DeliveryTransaction {
  id: string;
  driver_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'payout' | 'earning' | 'commission' | 'bonus' | 'refund';
  description: string;
  order_id?: string;
  created_at: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  api_key?: string;
  base_url: string;
  is_active: boolean;
  service_fee: number;
  credentials?: any;
  created_at: string;
  updated_at?: string;
}

export type DeliveryType = 'standard' | 'express' | 'scheduled' | 'restaurant';
