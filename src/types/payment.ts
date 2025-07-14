
export interface PaymentFormData {
  method: 'mobile_money' | 'card' | 'cash';
  mobileNumber?: string;
  provider?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolder?: string;
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

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}
