
import { Database } from "@/integrations/supabase/database.types";

export type RestaurantPromotion = Database['public']['Tables']['restaurant_promotions']['Row'];
export type RestaurantPromotionInsert = Database['public']['Tables']['restaurant_promotions']['Insert'];
export type RestaurantPromotionUpdate = Database['public']['Tables']['restaurant_promotions']['Update'];

export type DiscountType = 'percentage' | 'fixed_amount' | 'free_delivery';

export interface PromotionCondition {
  type: string;
  value: string | number;
  description: string;
}
