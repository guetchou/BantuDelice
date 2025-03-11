
export type DeliveryDriverStatus = 'available' | 'busy' | 'offline' | 'on_break';
export type DeliveryType = 'restaurant' | 'external' | 'pickup';
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'delivering' | 'delivered' | 'failed';

export interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  current_latitude?: number;
  current_longitude?: number;
  current_location?: string;
  last_location_update?: string;
  status: DeliveryDriverStatus;
  is_available: boolean;
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  commission_rate: number; // pourcentage de commission sur chaque livraison
  created_at: string;
  updated_at: string;
  restaurant_id?: string; // Null pour les livreurs externes
  vehicle_type?: 'bike' | 'scooter' | 'car' | 'walk';
}

export interface DeliveryZone {
  id: string;
  name: string;
  restaurant_id: string;
  polygon: GeoJSON.Polygon;
  delivery_fee: number;
  minimum_order: number;
  estimated_time_range: {
    min: number; // minutes
    max: number; // minutes
  };
  active: boolean;
}

export interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  customer_id: string;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  delivery_instructions?: string;
  delivery_type: DeliveryType;
  status: DeliveryStatus;
  assigned_driver_id?: string;
  external_service_id?: string;
  pickup_time?: string;
  delivery_time?: string;
  distance_km: number;
  fee: number;
  tip_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryTracking {
  id: string;
  delivery_request_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  status: DeliveryStatus;
  timestamp: string;
  notes?: string;
}

export interface DeliveryServiceProvider {
  id: string;
  name: string;
  logo_url?: string;
  base_fee: number;
  fee_per_km: number;
  commission_percentage: number;
  is_active: boolean;
  api_key?: string;
  webhook_url?: string;
}
