
import { Database } from "@/integrations/supabase/database.types";

export type Wallet = Database['public']['Tables']['wallets']['Row'];
export type WalletInsert = Database['public']['Tables']['wallets']['Insert'];
export type WalletUpdate = Database['public']['Tables']['wallets']['Update'];

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export type TransactionType = 'deposit' | 'withdraw' | 'payment' | 'refund' | 'commission' | 'bonus' | 'cashback' | 'cashback_transfer';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'scheduled';

export interface DriverWallet {
  id: string;
  driver_id: string;
  balance: number;
  total_earnings: number;
  commission_rate: number;
  last_payout_date?: string;
  payout_method?: string;
  payout_details?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DriverTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  reference_id?: string;
  description?: string;
  payment_method?: string;
  scheduled_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface WalletSummary {
  balance: number;
  totalEarnings: number;
  pendingAmount: number;
  lastTransactions: DriverTransaction[];
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  payment_type: 'mobile' | 'card' | 'bank' | 'cashdelivery';
  provider?: string;
  last_four: string;
  is_default: boolean;
  metadata?: Record<string, any>;
  last_used?: string;
  created_at: string;
  updated_at?: string;
}

export interface Commission {
  id: string;
  restaurant_id: string;
  rate: number;
  fixed_amount?: number;
  min_amount?: number;
  max_amount?: number;
  is_percentage: boolean;
  effective_from: string;
  effective_to?: string;
  created_at: string;
  updated_at?: string;
}

export interface RestaurantSubscription {
  id: string;
  restaurant_id: string;
  plan_type: 'basic' | 'premium' | 'elite';
  price: number;
  start_date: string;
  end_date: string;
  features: string[];
  auto_renew: boolean;
  status: 'active' | 'expired' | 'cancelled';
  payment_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  due_date: string;
  items?: {
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  pdf_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Cashback {
  id: string;
  user_id: string;
  balance: number;
  lifetime_earned: number;
  tier: 'bronze' | 'silver' | 'gold';
  tier_progress: number;
  last_updated: string;
  expiry_date?: string;
  created_at: string;
}

export interface CashbackTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earned' | 'used' | 'expired' | 'transferred' | 'received' | 'refunded';
  reference_id?: string;
  reference_type?: 'order' | 'transfer' | 'promotion' | 'refund';
  receiver_id?: string;
  sender_id?: string;
  description?: string;
  created_at: string;
}

export interface CashbackTransfer {
  id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: string;
}

export interface CashbackTier {
  name: 'bronze' | 'silver' | 'gold';
  minimum_points: number;
  cashback_rate: number;
  benefits: string[];
  icon: string;
  color: string;
}
