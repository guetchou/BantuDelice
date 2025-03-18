
export interface DeliveryMessage {
  id: string;
  delivery_request_id: string;
  order_id?: string | null;
  sender_id?: string | null;
  message: string;
  sender_type: 'driver' | 'customer';
  read?: boolean | null;
  created_at?: string | null;
}

export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  status: string;
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  current_latitude: number;
  current_longitude: number;
  current_location?: [number, number];
  is_available: boolean;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  last_location_update: string;
  vehicle_type?: string;
  profile_picture?: string;
  restaurant_id?: string;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  status: string;
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
  priority: number;
  estimated_distance: number;
  estimated_duration: number;
  delivery_time?: string;
  delivery_instructions?: string;
  pickup_time?: string;
  distance_km: number;
  delivery_type: string;
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

export interface DeliveryDriverRating {
  id: string;
  driver_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  polygon: any;
  minimum_order: number;
  base_delivery_fee: number;
  estimated_time_range: any;
  created_at: string;
}

export interface UserPaymentMethod {
  id: string;
  user_id: string;
  payment_type: string;
  provider: string;
  last_four: string;
  expiry_date?: string;
  is_default: boolean;
  metadata?: any;
  created_at: string;
  last_used?: string;
}

export interface DeliverySettings {
  id: string;
  restaurant_id: string;
  is_enabled: boolean;
  delivery_radius: number;
  minimum_order: number;
  base_delivery_fee: number;
  free_delivery_min?: number;
  estimated_time_range: string;
  allow_scheduling: boolean;
  use_external_service: boolean;
  external_service_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  logo_url?: string;
  base_fee: number;
  price_per_km?: number;
  estimated_time: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Enum type for delivery status
export type DeliveryStatus = 
  | 'pending'
  | 'accepted'
  | 'pickup'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'failed';

// Enum type for delivery type
export type DeliveryType =
  | 'standard'
  | 'express'
  | 'scheduled'
  | 'partner';
