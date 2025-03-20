
// This contains the type definitions for delivery-related entities

export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  current_latitude: number;
  current_longitude: number;
  current_location?: string;
  current_order_id?: string;
  status: "available" | "busy" | "offline" | "on_break";
  is_available: boolean;
  is_external?: boolean;
  vehicle_type?: "bike" | "scooter" | "car" | "walk";
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  last_location_update: string;
  profile_picture?: string;
  distance?: number;
  verification_status?: 'pending' | 'verified' | 'rejected';
  current_deliveries?: number;
  max_concurrent_deliveries?: number;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  user_id: string;
  driver_id?: string;
  assigned_driver_id?: string;
  status: "pending" | "assigned" | "picked_up" | "delivering" | "delivered" | "cancelled";
  pickup_address: string;
  delivery_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_latitude: number;
  delivery_longitude: number;
  delivery_instructions?: string;
  estimated_distance: number;
  estimated_duration?: number;
  delivery_fee: number;
  delivery_time?: string;
  pickup_time?: string;
  created_at: string;
  updated_at: string;
  assigned_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  requested_at?: string;
  completed_at?: string;
  is_priority?: boolean;
  payment_status: "pending" | "paid" | "failed";
  payment_method: "cash" | "card" | "wallet";
  tip_amount?: number;
  distance?: number;
  distance_km?: number;
  delivery_type?: 'standard' | 'express' | 'scheduled';
  is_external?: boolean;
  external_service_id?: string;
  route_polyline?: string;
}

export interface DeliveryDriverRating {
  id: string;
  delivery_request_id: string;
  user_id: string;
  driver_id: string;
  rating: number;
  comments?: string;
  timeliness_rating?: number;
  food_condition_rating?: number;
  driver_courtesy_rating?: number;
  created_at: string;
  order_id?: string;
  comment?: string;
}

export interface DeliverySettings {
  id: string;
  restaurant_id: string;
  delivery_radius: number;
  base_delivery_fee: number;
  fee_per_km: number;
  min_order_amount: number;
  free_delivery_min_amount?: number;
  delivery_time_window: [number, number]; // [min, max] in minutes
  active_delivery: boolean;
  active_external_services: string[];
  priority_fee_percentage: number;
  created_at: string;
  updated_at: string;
  allow_restaurant_delivery?: boolean;
  allow_external_delivery?: boolean;
  default_delivery_fee?: number;
  free_delivery_threshold?: number;
  max_delivery_distance?: number;
  estimated_delivery_time?: number;
  auto_accept_orders?: boolean;
  auto_assign_drivers?: boolean;
}

export interface DeliveryMessage {
  id: string;
  delivery_request_id?: string;
  order_id?: string;
  sender_id?: string;
  sender_type: "driver" | "customer";
  message: string;
  read?: boolean;
  created_at?: string;
}

export interface DeliveryCancellationReason {
  id: string;
  reason: string;
  for_driver: boolean;
  for_customer: boolean;
  penalty_applies: boolean;
  created_at: string;
}

export type DeliveryStatus = "pending" | "assigned" | "picked_up" | "delivering" | "delivered" | "cancelled";
export type DeliveryType = "standard" | "express" | "scheduled";

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  polygon: GeoJSON.Polygon;
  coordinates?: [number, number][]; // Simplified coordinates for frontend use
  base_delivery_fee: number;
  minimum_order: number;
  estimated_time_range: [number, number]; // [min, max] in minutes
  created_at: string;
}

export interface DeliveryRating {
  id: string;
  delivery_request_id: string;
  user_id: string;
  driver_id: string;
  rating: number;
  comments?: string;
  timeliness_rating?: number;
  food_condition_rating?: number;
  driver_courtesy_rating?: number;
  created_at: string;
}

export interface DeliveryVerification {
  id: string;
  driver_id: string;
  document_type: string;
  document_url: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'completed' | 'cancelled';
  stops: DeliveryStop[];
  total_distance: number;
  estimated_duration: number;
}

export interface DeliveryStop {
  id: string;
  route_id: string;
  order_id: string;
  request_id?: string;
  type: 'pickup' | 'delivery';
  address: string;
  latitude: number;
  longitude: number;
  sequence: number;
  status: 'pending' | 'completed';
  estimated_arrival: string;
  actual_arrival?: string;
  is_priority: boolean;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  api_key: string;
  active: boolean;
  base_fee: number;
  fee_per_km: number;
  service_area: string;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  estimated_pickup_time: number;
}
