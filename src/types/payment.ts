
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'mobile_money' | 'cash' | 'wallet';
  details: any;
  is_default?: boolean;
}

export interface PaymentFormData {
  method: string;
  amount: number;
  currency: string;
  phoneNumber?: string;
  operator?: string;
  lastFour?: string;
}

export interface PaymentTransaction {
  id: string;
  method: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
  orderId: string;
  description: string;
  phoneNumber?: string;
  operator?: string;
  lastFour?: string;
}
