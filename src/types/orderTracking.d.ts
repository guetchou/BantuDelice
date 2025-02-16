
export interface OrderTrackingDetails {
  id: string;
  order_id: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered';
  estimated_delivery_time?: string;
  current_location?: [number, number];
  updated_at: string;
  notes?: string;
}
