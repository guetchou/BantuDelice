
export interface DeliveryRequest {
  id: string;
  driver_id?: string;
  assigned_driver_id?: string;
  order_id: string;
  restaurant_id: string;
  customer_id: string;
  status: DeliveryStatus;
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
  delivery_address?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  estimated_duration?: number;
  distance?: number;
  is_external?: boolean;
  accepted_at?: string;
  completed_at?: string;
  requested_at?: string;
  delivery_fee?: number;
  pickup_time?: string;
  delivery_type?: string;
}

export type DeliveryStatus = 'pending' | 'assigned' | 'accepted' | 'picked_up' | 'delivering' | 'delivered' | 'completed' | 'failed' | 'cancelled';

export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_type: 'bike' | 'car' | 'scooter' | 'walk';
  license_plate?: string;
  status: 'available' | 'busy' | 'offline' | 'on_break';
  last_location_latitude?: number;
  last_location_longitude?: number;
  last_active?: string;
  rating?: number;
  total_deliveries?: number;
  profile_image_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  current_latitude?: number;
  current_longitude?: number;
  distance?: number;
  profile_picture?: string;
  is_external?: boolean;
  average_rating?: number;
  is_available?: boolean;
  commission_rate?: number;
  current_deliveries?: number;
  max_concurrent_deliveries?: number;
  languages?: string[];
  verified?: boolean;
  years_experience?: number;
  vehicle_model?: string;
  photo_url?: string;
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
  delivery_hours: any[];
  auto_assign_drivers: boolean;
  auto_assign: boolean;
  max_distance: number;
  external_service_enabled: boolean;
  service_fee_percentage: number;
  accepted_external_services?: string[];
  auto_accept_orders?: boolean;
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

export interface DeliveryMessage {
  id: string;
  delivery_id: string;
  sender_id: string;
  sender_type: 'customer' | 'driver' | 'restaurant' | 'system';
  message: string;
  created_at: string;
  read: boolean;
}

export interface DeliveryVerification {
  id: string;
  driver_id: string;
  document_type: 'id_card' | 'driver_license' | 'background_check' | 'passport' | 'proof_of_address';
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  notes?: string;
  verification_status?: string;
  rejection_reason?: string;
  document_number?: string;
  created_at?: string;
}

export type DeliveryType = 'standard' | 'express' | 'scheduled';

export interface DeliveryRoute {
  id?: string;
  driver_id: string;
  stops: DeliveryRouteStop[];
  total_distance: number;
  total_duration: number;
  created_at: string;
  delivery_requests?: DeliveryRequest[];
  waypoints?: any[];
  start_time?: string;
  estimated_end_time?: string;
}

export interface DeliveryRouteStop {
  delivery_id: string;
  type: 'pickup' | 'dropoff';
  address: string;
  latitude: number;
  longitude: number;
  estimated_arrival: string;
  sequence: number;
  request_id?: string;
  is_priority?: boolean;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  api_key: string;
  logo_url: string;
  is_active: boolean;
  base_fee: number;
  fee_per_km: number;
  service_area: {
    center_lat: number;
    center_lng: number;
    radius_km: number;
  };
  available_vehicle_types: string[];
}
