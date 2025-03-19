
import { Database } from "@/integrations/supabase/database.types";

export type Payment = Database['public']['Tables']['payments']['Row'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

export type PaymentMethod = Database['public']['Tables']['payment_methods']['Row'];
export type PaymentMethodInsert = Database['public']['Tables']['payment_methods']['Insert'];
export type PaymentMethodUpdate = Database['public']['Tables']['payment_methods']['Update'];

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';

export interface UserPaymentMethod {
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

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'mobile_money' | 'card' | 'bank' | 'cash';
  is_active: boolean;
  configuration: Record<string, any>;
  fee_percentage?: number;
  fee_fixed?: number;
  created_at: string;
  updated_at?: string;
}

export interface PaymentCommission {
  id: string;
  service_type: 'restaurant' | 'delivery' | 'taxi' | 'other';
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

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  created_at: string;
  updated_at?: string;
}

export interface MobileMoneyProvider {
  id: string;
  name: string;
  code: 'mtn' | 'airtel' | 'orange';
  logo_url?: string;
  country_codes: string[];
  is_active: boolean;
  min_amount?: number;
  max_amount?: number;
  configuration: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface MobileMoneyTransaction {
  id: string;
  user_id: string;
  provider: 'mtn' | 'airtel' | 'orange';
  phone_number: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transaction_reference: string;
  provider_reference?: string;
  metadata?: Record<string, any>;
  created_at: string;
  completed_at?: string;
  failed_at?: string;
  error_message?: string;
}

export interface Refund {
  id: string;
  payment_id: string;
  order_id?: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  refund_type: 'original_payment' | 'wallet_credit' | 'cashback';
  refunded_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface CashbackPromotion {
  id: string;
  name: string;
  description: string;
  rate: number;
  is_percentage: boolean;
  min_order_amount?: number;
  start_date: string;
  end_date?: string;
  payment_methods?: ('mtn' | 'airtel' | 'orange' | 'card' | 'wallet')[];
  user_type?: 'new' | 'existing' | 'all';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// Ajouter les types Supabase pour le cashback
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
