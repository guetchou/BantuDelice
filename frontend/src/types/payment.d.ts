
// Payment method types
export type PaymentMethod = 'mobile' | 'wallet' | 'company' | 'subscription';

// Payment statuses
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

// Transaction interface
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'credit';
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  reference?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Payment details for orders
export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  amount: number;
  currency: string;
  receipt_url?: string;
  processor_response?: string;
  paid_at?: string;
}

// Wallet interface
export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
  last_transaction_at?: string;
}

// Mobile payment provider
export interface MobilePaymentProvider {
  id: string;
  name: string;
  logo_url: string;
  country_code: string;
  is_active: boolean;
  processing_fee?: number;
  minimum_amount?: number;
}

// Payment form data
export interface PaymentFormData {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  mobileNumber?: string;
  emailAddress?: string;
  savePaymentMethod?: boolean;
  provider?: string;
}

// Saved payment method
export interface SavedPaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'mobile' | 'bank';
  last_four?: string;
  provider?: string;
  expires?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  label?: string;
  icon?: string;
}

// Cashback interfaces
export interface Cashback {
  id: string;
  user_id: string;
  amount: number;
  status: PaymentStatus;
  source: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lifetime_earned: number;
}

export interface CashbackTransaction {
  id: string;
  user_id: string;
  cashback_id: string;
  amount: number;
  type: 'earn' | 'redeem' | 'expire';
  reference_id?: string;
  reference_type?: string;
  created_at: string;
  description?: string;
}
