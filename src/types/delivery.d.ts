
export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_type: 'car' | 'bike' | 'motorcycle' | 'scooter' | 'walk';
  status: 'available' | 'busy' | 'offline' | 'on_break';
  current_latitude?: number;
  current_longitude?: number;
  profile_picture?: string;
  is_available?: boolean;
  is_external?: boolean;
  total_deliveries?: number;
  average_rating?: number;
  distance?: number;
  current_deliveries?: number;
  max_concurrent_deliveries?: number;
  commission_rate?: number;
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address?: string;
  type?: 'pickup' | 'dropoff';
  timestamp?: string;
  request_id?: string;
  is_priority?: boolean;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  customer_id: string;
  driver_id?: string;
  assigned_driver_id?: string;
  pickup_address: string;
  delivery_address: string;
  status: DeliveryStatus;
  created_at: string;
  updated_at: string;
  estimated_delivery_time?: string;
  priority: 'normal' | 'high' | 'urgent';
  is_priority?: boolean;
  delivery_type: DeliveryType;
  pickup_time?: string;
  distance?: number;
  estimated_duration?: number;
  is_external?: boolean;
  requested_at?: string;
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_fee?: number;
  customer_name: string;
  customer_phone: string;
  notes?: string;
}

export type DeliveryStatus = 'pending' | 'assigned' | 'accepted' | 'in_progress' | 'picked_up' | 'in_transit' | 'delivering' | 'delivered' | 'cancelled' | 'failed' | 'completed';
export type DeliveryType = 'standard' | 'scheduled' | 'express' | 'restaurant';

export interface DeliverySettings {
  id: string;
  restaurant_id: string;
  min_order_value: number;
  delivery_radius: number;
  delivery_fee_base: number;
  delivery_fee_per_km: number;
  delivery_fee_min: number;
  auto_accept_orders?: boolean;
  auto_assign_drivers?: boolean;
  estimated_delivery_time?: number;
  accepted_external_services?: string[];
  allow_restaurant_delivery?: boolean;
  allow_external_delivery?: boolean;
  default_delivery_fee?: number;
  free_delivery_threshold?: number;
  max_delivery_distance?: number;
  delivery_hours?: DeliveryHours[];
}

export interface DeliveryHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;
  close: string;
}

export interface DeliveryRoute {
  id: string;
  driver_id: string;
  stops: DeliveryLocation[];
  created_at: string;
  estimated_completion_time: string;
  status: 'active' | 'completed' | 'cancelled';
  waypoints?: any[];
  delivery_requests?: string[];
  total_distance?: number;
  start_time?: string;
  estimated_end_time?: string;
}

export interface DeliveryMessage {
  id: string;
  request_id: string;
  sender_type: 'customer' | 'driver' | 'restaurant' | 'system';
  sender_id: string;
  message: string;
  created_at: string;
  read_at?: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  logo_url: string;
  commission_rate: number;
  is_active: boolean;
  estimated_pickup_time: number;
  coverage_area: string[] | { lat: number; lng: number }[];
  base_fee?: number;
  fee_per_km?: number;
}
