
export type SubscriptionTier = 'standard' | 'premium' | 'elite';

export type SubscriptionInterval = 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionBenefitCategory = 
  | 'visibility' 
  | 'commission' 
  | 'marketing' 
  | 'support' 
  | 'tools' 
  | 'orders' 
  | 'security';

export interface SubscriptionBenefit {
  id: string;
  title: string;
  description: string;
  category: SubscriptionBenefitCategory;
  tier: SubscriptionTier | SubscriptionTier[];
  icon?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  description: string;
  price: number;
  interval: SubscriptionInterval;
  partner_type: 'restaurant' | 'driver';
  features: string[];
  popular?: boolean;
  badge_text?: string;
  commission_rate?: number;
  discount_percentage?: number;
  created_at: string;
  updated_at?: string;
}

export interface PartnerSubscription {
  id: string;
  user_id: string;
  partner_id: string;
  partner_type: 'restaurant' | 'driver';
  plan_id: string;
  plan?: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface SubscriptionTransaction {
  id: string;
  subscription_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  invoice_url?: string;
  created_at: string;
}
