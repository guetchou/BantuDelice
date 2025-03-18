
export interface OrderTrackingDetails {
  id: string;
  order_id: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered';
  timestamp: string;
  updated_at: string;
  estimated_delivery_time: string;
  location_data: {
    latitude: number;
    longitude: number;
  } | null;
  notes: string;
  handled_by: string;
}

export interface DeliveryStep {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'waiting';
  time?: string;
  icon: string;
}

export interface OrderTrackingUpdate {
  status: string;
  timestamp: string;
  location?: [number, number];
  notes?: string;
}

export interface OrderTrackingRoutePoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  status: string;
}
