
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
