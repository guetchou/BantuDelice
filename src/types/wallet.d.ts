
import { Database } from "@/integrations/supabase/database.types";

export type Wallet = Database['public']['Tables']['wallets']['Row'];
export type WalletInsert = Database['public']['Tables']['wallets']['Insert'];
export type WalletUpdate = Database['public']['Tables']['wallets']['Update'];

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export type TransactionType = 'deposit' | 'withdraw' | 'payment' | 'refund' | 'commission' | 'bonus';
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
