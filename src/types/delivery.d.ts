
import { Database } from "@/integrations/supabase/database.types";

export type DeliveryPreferences = Database['public']['Tables']['delivery_preferences']['Row'];
export type DeliveryPreferencesInsert = Database['public']['Tables']['delivery_preferences']['Insert'];
export type DeliveryPreferencesUpdate = Database['public']['Tables']['delivery_preferences']['Update'];

export interface DeliveryTimes {
  weekday: string[];
  weekend: string[];
}

