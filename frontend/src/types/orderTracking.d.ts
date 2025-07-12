
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'ready' | 'cancelled';

export interface OrderTrackingDetails {
  id: string;
  order_id: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered';
  timestamp: string;
  updated_at: string;
  estimated_delivery_time: string;
  location_data?: Record<string, any> | null;
  notes?: string;
  handled_by?: string;
}

export interface OrderTrackingRoutePoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  status?: string;
}

export interface OrderProgressStep {
  status: OrderStatus;
  label: string;
  time?: string;
  completed: boolean;
  icon?: React.ComponentType<any>;
}
