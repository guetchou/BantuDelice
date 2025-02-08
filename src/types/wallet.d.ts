
import { Database } from "@/integrations/supabase/database.types";

export type Wallet = Database['public']['Tables']['wallets']['Row'];
export type WalletInsert = Database['public']['Tables']['wallets']['Insert'];
export type WalletUpdate = Database['public']['Tables']['wallets']['Update'];

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export type TransactionType = 'deposit' | 'withdraw' | 'payment' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

