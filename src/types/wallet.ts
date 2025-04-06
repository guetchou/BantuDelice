
export interface CashbackTier {
  name: string;
  minimum_points: number;
  cashback_rate: number;
  benefits: string[];
  icon: string;
  color: string;
}

export interface Cashback {
  id: string;
  user_id: string;
  balance: number;
  lifetime_earned: number;
  tier: string;
  tier_name: string;
  tier_progress: number;
  points_to_next_tier: number;
  benefits: string[];
  last_updated: string;
  created_at: string;
}

export type CashbackTransactionType = 'earn' | 'redeem' | 'expire';

export interface CashbackTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: CashbackTransactionType;
  reference_id?: string;
  reference_type?: string;
  sender_id?: string;
  receiver_id?: string;
  description?: string;
  created_at: string;
}
