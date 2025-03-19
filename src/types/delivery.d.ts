
export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  current_latitude: number;
  current_longitude: number;
  current_location?: {
    latitude: number;
    longitude: number;
  };
  last_location_update: string;
  current_order_id?: string;
  total_deliveries: number;
  average_rating: number;
  commission_rate: number;
  total_earnings: number;
  is_available: boolean;
  updated_at: string;
  created_at: string;
  distance?: number;
  estimated_time?: number;
  vehicle_type?: 'bike' | 'car' | 'scooter' | 'walk';
  profile_picture?: string;
  is_external?: boolean;
  service_id?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  identity_verified?: boolean;
  document_verified?: boolean;
  background_check?: boolean;
  cancellation_rate?: number;
  blocked?: boolean;
  blocked_reason?: string;
  current_earnings?: number;
  active_routes?: DeliveryRoute[];
  max_concurrent_deliveries?: number;
  current_deliveries?: number;
  wallet_id?: string;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  customer_id: string;
  pickup_address: string;
  delivery_address: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  assigned_driver_id?: string;
  pickup_time?: string;
  delivery_time?: string;
  distance?: number;
  estimated_duration?: number;
  delivery_fee: number;
  special_instructions?: string;
  is_priority: boolean;
  external_service_id?: string;
  created_at: string;
  updated_at: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_latitude?: number;
  delivery_longitude?: number;
  route_optimization?: boolean;
  delivery_order?: number;
  batch_id?: string;
  requested_at?: string;
  accepted_at?: string;
  completed_at?: string;
}

export interface DeliveryTracking {
  id: string;
  delivery_request_id: string;
  order_id: string;
  driver_id: string;
  status: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  updated_at: string;
  picked_up_at?: string;
  delivered_at?: string;
  notes?: string;
}

export interface DeliveryMessage {
  id: string;
  delivery_request_id: string;
  order_id?: string;
  sender_id?: string;
  sender_type: 'driver' | 'customer';
  message: string;
  read?: boolean;
  created_at?: string;
}

export interface DeliverySettings {
  id: string;
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_radius: number;
  base_delivery_fee: number;
  fee_per_km: number;
  min_order_amount_for_delivery: number;
  free_delivery_min_amount: number;
  estimated_preparation_time: number;
  priority_delivery_fee: number;
  active_external_services: string[];
  created_at: string;
  updated_at: string;
  max_delivery_distance?: number;
  estimated_delivery_time?: number;
  auto_accept_orders?: boolean;
  auto_assign_drivers?: boolean;
  default_delivery_fee?: number;
  free_delivery_threshold?: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  polygon: any;
  active: boolean;
  minimum_order: number;
  base_delivery_fee: number;
  estimated_delivery_time: {
    min: number;
    max: number;
  };
  created_at: string;
  updated_at?: string;
}

export interface DeliveryRating {
  id: string;
  driver_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  logo_url?: string;
  base_fee: number;
  fee_per_km?: number;
  estimated_time: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  delivery_requests: string[];
  status: 'active' | 'completed' | 'cancelled';
  start_time: string;
  estimated_end_time: string;
  actual_end_time?: string;
  total_distance: number;
  total_duration: number;
  waypoints: {
    latitude: number;
    longitude: number;
    type: 'pickup' | 'delivery';
    request_id: string;
    order: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface DeliveryVerification {
  id: string;
  driver_id: string;
  document_type: 'id_card' | 'driver_license' | 'passport' | 'proof_of_address';
  document_number: string;
  document_url: string;
  expiry_date?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  rejection_reason?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryDriverRating {
  id: string;
  driver_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
