
export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  current_latitude: number;
  current_longitude: number;
  is_available: boolean;
  status: string;
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  last_location_update: string;
  
  // Additional properties needed by components
  vehicle_type?: string;
  profile_picture?: string;
  verification_status?: string;
  is_external?: boolean;
  distance?: number;
  max_concurrent_deliveries?: number;
  languages?: string[];
  current_deliveries?: any[];
  current_order_id?: string;
}

export interface DeliveryMessage {
  id: string;
  order_id: string;
  sender_type: "driver" | "customer";
  sender_id: string;
  message: string;
  created_at: string;
}

export interface DeliveryRequest {
  id: string;
  driver_id?: string | null;
  status: DeliveryStatus;
  
  // Original properties
  pickup_latitude?: number;
  pickup_longitude?: number;
  dropoff_latitude?: number;
  dropoff_longitude?: number;
  
  // Additional properties needed for compatibility
  order_id?: string;
  pickup_address?: string;
  delivery_address?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  delivery_type?: string;
  assigned_driver_id?: string;
  pickup_time?: string;
  estimated_duration?: number;
  restaurant_id?: string;
  is_priority?: boolean;
  distance?: number;
  distance_km?: number;
  is_external?: boolean;
  requested_at?: string;
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  delivery_fee?: number;
  notes?: string;
  external_service_id?: string;
  priority?: string;
  estimated_distance?: number;
  delivery_time?: string;
  delivery_instructions?: string;
  dropoff_address?: string;
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  stops: DeliveryRouteStop[];
  created_at: string;
  updated_at: string;
  
  // Additional properties needed by components
  delivery_requests?: DeliveryRequest[];
  total_distance?: number;
  start_time?: string;
  estimated_end_time?: string;
  waypoints?: any[];
}

export interface DeliveryRouteStop {
  request_id: string;
  order: number;
  type: string;
  latitude: number;
  longitude: number;
  is_priority?: boolean;
}

export interface DeliveryVerification {
  id: string;
  driver_id: string;
  document_type: string;
  document_number: string;
  document_image: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  verified_at?: string;
  verification_status?: string;
  document_url?: string;
}

export type DeliveryDriverStatus = 
  | "online" 
  | "offline" 
  | "busy" 
  | "on_break";

export type DeliveryStatus = 
  | "pending" 
  | "accepted" 
  | "in_progress" 
  | "completed" 
  | "cancelled"
  | "assigned"
  | "picked_up"
  | "delivering"
  | "delivered"
  | "failed";

export interface DeliveryDriverRating {
  id: string;
  driver_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface DeliverySettings {
  auto_assign: boolean;
  max_distance: number;
  external_service_enabled: boolean;
  service_fee_percentage: number;
  restaurant_id?: string;
  accepted_external_services?: string[];
  allow_restaurant_delivery?: boolean;
  allow_external_delivery?: boolean;
  default_delivery_fee?: number;
  free_delivery_threshold?: number;
  max_delivery_distance?: number;
  estimated_delivery_time?: number;
  auto_accept_orders?: boolean;
  auto_assign_drivers?: boolean;
  delivery_hours?: any;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  base_url: string;
  api_key: string;
  enabled: boolean;
  base_fee?: number;
  fee_per_km?: number;
}

export type DeliveryType = 'internal' | 'external' | 'self_pickup';

export interface TableExistenceOptions {
  tableName: string;
}

// Extension for route optimization
export interface OptimizationWaypoint {
  latitude: number;
  longitude: number;
  request_id?: string;
  type?: string;
  is_priority?: boolean;
}
