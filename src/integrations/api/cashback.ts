
import { apiRequest } from "./core";

// Cashback API functions
export const cashbackApi = {
  getBalance: async () => {
    return apiRequest('/cashback/balance', 'GET');
  },
  
  getTransactions: async (limit = 10, offset = 0) => {
    return apiRequest(`/cashback/transactions?limit=${limit}&offset=${offset}`, 'GET');
  },
  
  transferCashback: async (data: {
    receiver_id: string;
    amount: number;
    description?: string;
  }) => {
    return apiRequest('/cashback/transfer', 'POST', data);
  },
  
  redeemCashback: async (data: {
    amount: number;
    redemption_type: 'order_discount' | 'delivery_fee' | 'voucher';
  }) => {
    return apiRequest('/cashback/redeem', 'POST', data);
  },
  
  applyCashbackToOrder: async (data: {
    order_id: string;
    amount: number;
  }) => {
    return apiRequest('/cashback/apply-to-order', 'POST', data);
  },
  
  getLeaderboard: async (limit = 10) => {
    return apiRequest(`/cashback/leaderboard?limit=${limit}`, 'GET');
  },
  
  getCashbackTiers: async () => {
    return apiRequest('/cashback/tiers', 'GET');
  },
  
  getCashbackPromotions: async () => {
    return apiRequest('/cashback/promotions', 'GET');
  }
};
