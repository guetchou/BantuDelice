
import { any } from "@/integrations/supabase/database.types";

export type LoyaltyPoints = any['public']['Tables']['loyalty_points']['Row'];
export type LoyaltyPointsInsert = any['public']['Tables']['loyalty_points']['Insert'];
export type LoyaltyPointsUpdate = any['public']['Tables']['loyalty_points']['Update'];

export type LoyaltyReward = any['public']['Tables']['loyalty_rewards']['Row'];
export type LoyaltyRewardInsert = any['public']['Tables']['loyalty_rewards']['Insert'];
export type LoyaltyRewardUpdate = any['public']['Tables']['loyalty_rewards']['Update'];

export type LoyaltyRewardHistory = any['public']['Tables']['loyalty_rewards_history']['Row'];
export type LoyaltyRewardHistoryInsert = any['public']['Tables']['loyalty_rewards_history']['Insert'];
export type LoyaltyRewardHistoryUpdate = any['public']['Tables']['loyalty_rewards_history']['Update'];

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface LoyaltyBenefit {
  type: string;
  value: string | number;
  description: string;
}
