
import { any } from "@/integrations/supabase/database.types";

export type ReferralProgram = {
  id: string;
  user_id: string;
  referral_code: string;
  referrals_count: number;
  rewards_earned: number;
  created_at: string;
  updated_at?: string;
};

export type ReferralReward = {
  id: string;
  program_id: string;
  reward_type: 'discount' | 'points' | 'cashback';
  reward_amount: number;
  status: 'pending' | 'processed' | 'claimed';
  referral_date: string;
  created_at: string;
  updated_at?: string;
};

export type DriverReferral = {
  id: string;
  driver_id: string;
  referred_driver_id: string;
  status: 'pending' | 'approved' | 'rejected';
  bonus_amount: number;
  is_paid: boolean;
  created_at: string;
  updated_at?: string;
};

export type SponsoredItem = {
  id: string;
  restaurant_id: string;
  item_id: string;
  start_date: string;
  end_date: string;
  fee_paid: number;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at?: string;
};

export type InfluencerCampaign = {
  id: string;
  name: string;
  description: string;
  restaurant_id: string;
  influencer_id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'other';
  budget: number;
  start_date: string;
  end_date: string;
  status: 'planned' | 'active' | 'completed';
  metrics?: {
    views?: number;
    engagement?: number;
    clicks?: number;
    conversions?: number;
  };
  created_at: string;
  updated_at?: string;
};
