
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
  points_to_next_tier: number | null;
  benefits: string[];
  last_updated: string;
  created_at: string;
  points?: number;
  lifetime_points?: number;
  level?: string;
}

export type CashbackTransactionType = 'earn' | 'redeem' | 'expire' | 'earned' | 'used' | 'received' | 'transferred' | 'refunded';

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

export interface WalletSummary {
  total_earnings: number;
  total_withdrawals: number;
  current_balance: number;
  available_balance: number;
  pending_earnings: number;
}

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

export interface DriverWallet {
  id: string;
  driver_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
  commission_rate?: number;
  total_earnings?: number;
  payout_details?: any;
}

export interface DriverTransaction {
  id: string;
  driver_wallet_id: string;
  amount: number;
  type: 'earning' | 'withdrawal' | 'bonus' | 'fee' | 'withdraw' | 'deposit' | 'payment' | 'commission';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
  reference_number?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}
