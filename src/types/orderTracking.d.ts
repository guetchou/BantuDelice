
export interface OrderTrackingRoutePoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  status?: string;
}

export interface OrderTrackingDetails {
  id: string;
  order_id: string;
  current_location: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  route_points: OrderTrackingRoutePoint[];
  status: string;
  estimated_delivery_time: string;
  actual_delivery_time?: string;
  driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  vehicle_details?: string;
}
