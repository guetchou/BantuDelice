
import { apiRequest } from "./core";

// Payment API functions
export const paymentApi = {
  processMobileMoneyPayment: async (paymentData: {
    phoneNumber: string;
    amount: number;
    provider: 'mtn' | 'airtel' | 'orange';
    description?: string;
    reference?: string;
  }) => {
    return apiRequest('/payments/mobile-money', 'POST', paymentData);
  },
  
  checkPaymentStatus: async (transactionId: string) => {
    return apiRequest(`/payments/status/${transactionId}`, 'GET');
  },
  
  getWalletBalance: async () => {
    return apiRequest('/payments/wallet/balance', 'GET');
  },
  
  withdrawFunds: async (data: {
    amount: number;
    destination: string;
    provider: 'mtn' | 'airtel' | 'orange' | 'bank';
  }) => {
    return apiRequest('/payments/withdraw', 'POST', data);
  },
  
  getUserPaymentMethods: async () => {
    return apiRequest('/payments/methods', 'GET');
  },
  
  addPaymentMethod: async (data: {
    type: 'mobile' | 'card' | 'bank';
    provider?: string;
    accountNumber?: string;
    phoneNumber?: string;
    isDefault?: boolean;
  }) => {
    return apiRequest('/payments/methods', 'POST', data);
  },
  
  deletePaymentMethod: async (methodId: string) => {
    return apiRequest(`/payments/methods/${methodId}`, 'DELETE');
  },
  
  setDefaultPaymentMethod: async (methodId: string) => {
    return apiRequest(`/payments/methods/${methodId}/default`, 'PATCH');
  },
  
  // Refund handling
  requestRefund: async (data: {
    order_id: string;
    payment_id: string;
    amount: number;
    reason: string;
    refund_type: 'original_payment' | 'wallet_credit' | 'cashback';
  }) => {
    return apiRequest('/payments/refunds', 'POST', data);
  },
  
  getRefundStatus: async (refundId: string) => {
    return apiRequest(`/payments/refunds/${refundId}`, 'GET');
  },
  
  getAllRefunds: async () => {
    return apiRequest('/payments/refunds', 'GET');
  }
};
