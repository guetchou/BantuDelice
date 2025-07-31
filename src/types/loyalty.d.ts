
import { Database } from "@/integrations/supabase/database.types";

export type LoyaltyPoints = Database['public']['Tables']['loyalty_points']['Row'];
export type LoyaltyPointsInsert = Database['public']['Tables']['loyalty_points']['Insert'];
export type LoyaltyPointsUpdate = Database['public']['Tables']['loyalty_points']['Update'];

export type LoyaltyReward = Database['public']['Tables']['loyalty_rewards']['Row'];
export type LoyaltyRewardInsert = Database['public']['Tables']['loyalty_rewards']['Insert'];
export type LoyaltyRewardUpdate = Database['public']['Tables']['loyalty_rewards']['Update'];

export type LoyaltyRewardHistory = Database['public']['Tables']['loyalty_rewards_history']['Row'];
export type LoyaltyRewardHistoryInsert = Database['public']['Tables']['loyalty_rewards_history']['Insert'];
export type LoyaltyRewardHistoryUpdate = Database['public']['Tables']['loyalty_rewards_history']['Update'];

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface LoyaltyBenefit {
  type: string;
  value: string | number;
  description: string;
}
