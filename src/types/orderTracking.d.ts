
import { Database } from "@/integrations/supabase/database.types";

export type OrderTrackingDetails = Database['public']['Tables']['order_tracking_details']['Row'];
export type OrderTrackingDetailsInsert = Database['public']['Tables']['order_tracking_details']['Insert'];
export type OrderTrackingDetailsUpdate = Database['public']['Tables']['order_tracking_details']['Update'];

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

