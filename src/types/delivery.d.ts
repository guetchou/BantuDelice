
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
  timestamp?: string;
  type?: 'pickup' | 'delivery' | 'driver' | 'current';
  request_id?: string;
  is_priority?: boolean;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  license_plate?: string;
  rating?: number;
  profile_image?: string;
  status?: 'available' | 'busy' | 'offline';
  current_location?: {
    latitude: number;
    longitude: number;
  };
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
  assigned_driver?: DeliveryDriver;
  estimated_pickup_time?: string;
  actual_pickup_time?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  distance_km?: number;
  duration_min?: number;
  delivery_fee?: number;
  priority?: boolean;
  notes?: string;
  created_at: string;
  delivery_type?: 'standard' | 'scheduled' | 'express';
}

export interface DeliverySettings {
  restaurant_id: string;
  allow_restaurant_delivery: boolean;
  allow_external_delivery: boolean;
  default_delivery_fee: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  service_areas: string[];
  estimated_preparation_time: number;
  auto_assign_drivers: boolean;
  delivery_radius: number;
  delivery_time_estimate: number;
  delivery_buffer_time: number;
  priority_delivery_fee: number;
  min_order_amount: number;
  max_concurrent_deliveries: number;
  working_hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

export interface DeliveryTracking {
  delivery_id: string;
  current_location: DeliveryLocation;
  driver_id: string;
  status: DeliveryStatus;
  route_points: DeliveryLocation[];
  estimated_arrival_time: string;
}
