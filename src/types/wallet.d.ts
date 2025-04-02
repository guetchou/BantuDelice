
export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Cashback {
  id: string;
  user_id: string;
  balance: number;
  lifetime_earned: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tier_progress: number;
  tier_name: string;
  points_to_next_tier: number | null;
  benefits: string[];
  achievement_points?: number;
  lifetime_points?: number;
  points?: number;
  level?: string;
  created_at: string;
  last_updated: string;
}

export type CashbackTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
  reference_number?: string;
}

export interface CashbackTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'redeem' | 'expire';
  reference_id?: string;
  reference_type?: string;
  created_at: string;
  description?: string;
}

export interface DriverWallet {
  id: string;
  driver_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface DriverTransaction {
  id: string;
  driver_wallet_id: string;
  amount: number;
  type: 'earning' | 'withdrawal' | 'bonus' | 'fee';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
  reference_number?: string;
}

export interface WalletSummary {
  total_earnings: number;
  total_withdrawals: number;
  current_balance: number;
  available_balance: number;
  pending_earnings: number;
}
