
// Types pour les livraisons
export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  current_latitude: number;
  current_longitude: number;
  current_location?: string;
  is_available: boolean;
  status: 'online' | 'offline' | 'delivering';
  vehicle_type?: 'bike' | 'car' | 'scooter' | 'walk';
  total_deliveries: number;
  average_rating: number;
  profile_picture?: string;
  restaurant_id?: string;
  commission_rate: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
  last_location_update?: string;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'assigned' | 'picked_up' | 'delivering' | 'delivered' | 'failed';
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
  priority: 'normal' | 'high' | 'urgent';
  estimated_distance: number;
  estimated_duration: number;
  delivery_time?: string;
  delivery_instructions?: string;
  pickup_time?: string;
  distance_km?: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  polygon: GeoJSON.Polygon;
  base_delivery_fee: number;
  minimum_order: number;
  estimated_time_range: {
    min: number;
    max: number;
  };
  active: boolean;
  restaurant_id?: string;
  created_at: string;
}

export interface DeliveryTracking {
  id: string;
  delivery_request_id: string;
  driver_id: string;
  order_id: string;
  status: 'assigned' | 'picked_up' | 'on_the_way' | 'delivered' | 'failed';
  latitude: number;
  longitude: number;
  timestamp: string;
  notes?: string;
}

export interface ExternalDeliveryService {
  id: string;
  name: string;
  logo_url?: string;
  base_fee: number;
  fee_per_km?: number;
  base_distance?: number; // km covered by base fee
  minimum_fee: number;
  estimated_pickup_time: number; // minutes
  contact_phone: string;
  contact_email?: string;
  api_key?: string;
  api_url?: string;
  is_active: boolean;
  service_areas: string[]; // JSON array of area names
  commission_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface DeliverySettings {
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_fee: number;
  free_delivery_threshold?: number;
  max_delivery_distance: number;
  estimated_delivery_time: number;
  accepted_external_services: string[];
  custom_delivery_fees?: {
    zone_id: string;
    fee: number;
  }[];
  delivery_hours: {
    day: string;
    open: string;
    close: string;
  }[];
  auto_accept_orders: boolean;
  auto_assign_drivers: boolean;
}

export interface DeliveryMessage {
  id: string;
  delivery_request_id: string;
  sender_id: string;
  sender_type: 'driver' | 'customer' | 'restaurant';
  message: string;
  created_at: string;
  read: boolean;
}

// Type pour la notation des livreurs
export interface DeliveryDriverRating {
  id: string;
  delivery_request_id: string;
  order_id: string;
  driver_id: string;
  user_id: string;
  speed_rating: number;
  politeness_rating: number;
  overall_rating: number;
  comment?: string;
  created_at: string;
}

export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'delivering' | 'delivered' | 'failed';
export type DeliveryType = 'restaurant' | 'external' | 'pickup';
