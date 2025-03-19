
import { Database } from "@/integrations/supabase/database.types";

export type Payment = Database['public']['Tables']['payments']['Row'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

export type PaymentMethod = Database['public']['Tables']['payment_methods']['Row'];
export type PaymentMethodInsert = Database['public']['Tables']['payment_methods']['Insert'];
export type PaymentMethodUpdate = Database['public']['Tables']['payment_methods']['Update'];

export type PaymentStatus = 'pending' | 'completed' | 'failed';

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
