
import { any } from "@/integrations/supabase/database.types";

export type RestaurantPromotion = any['public']['Tables']['restaurant_promotions']['Row'];
export type RestaurantPromotionInsert = any['public']['Tables']['restaurant_promotions']['Insert'];
export type RestaurantPromotionUpdate = any['public']['Tables']['restaurant_promotions']['Update'];

export type DiscountType = 'percentage' | 'fixed_amount' | 'free_delivery';

export interface PromotionCondition {
  type: string;
  value: string | number;
  description: string;
}
