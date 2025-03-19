/**
 * Custom API client to interface with our backend API
 * This will progressively replace the Supabase client
 */
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for localStorage token management
const tokenStorage = {
  get: () => localStorage.getItem('auth_token'),
  set: (token: string) => localStorage.setItem('auth_token', token),
  remove: () => localStorage.removeItem('auth_token')
};

// Helper for making authenticated requests
const apiRequest = async (
  endpoint: string, 
  method: string = 'GET', 
  data: any = null, 
  requiresAuth: boolean = true
) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const token = tokenStorage.get();
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(requiresAuth && token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      ...(data ? { body: JSON.stringify(data) } : {})
    };

    const response = await fetch(url, options);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Something went wrong');
    }
    
    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    
    // Show toast notification for errors
    if (error instanceof Error) {
      toast.error(error.message);
    }
    
    throw error;
  }
};

// Auth functions
export const authApi = {
  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    const data = await apiRequest('/auth/register', 'POST', {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    }, false);
    
    if (data.token) {
      tokenStorage.set(data.token);
    }
    
    return data;
  },
  
  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', 'POST', { email, password }, false);
    
    if (data.token) {
      tokenStorage.set(data.token);
    }
    
    return data;
  },
  
  logout: () => {
    tokenStorage.remove();
  },
  
  getUser: async () => {
    const token = tokenStorage.get();
    if (!token) return null;
    
    try {
      const data = await apiRequest('/auth/me');
      return data.user;
    } catch (error) {
      // If authentication fails, clear the token
      tokenStorage.remove();
      return null;
    }
  },
  
  isAuthenticated: () => {
    return !!tokenStorage.get();
  }
};

// Restaurant functions
export const restaurantApi = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/restaurants${queryString}`, 'GET', null, false);
  },
  
  getById: async (id: string) => {
    return apiRequest(`/restaurants/${id}`, 'GET', null, false);
  },
  
  getMenu: async (id: string) => {
    return apiRequest(`/restaurants/${id}/menu`, 'GET', null, false);
  },
  
  // New methods for availability management
  updateMenuItemAvailability: async (itemId: string, available: boolean) => {
    return apiRequest(`/availability/menu-items/${itemId}`, 'PATCH', { available });
  },
  
  updateMenuItemStock: async (itemId: string, stockLevel: number) => {
    return apiRequest(`/availability/menu-items/${itemId}`, 'PATCH', { stock_level: stockLevel });
  },
  
  updateStatus: async (restaurantId: string, statusData: any) => {
    return apiRequest(`/availability/restaurants/${restaurantId}`, 'PATCH', statusData);
  },
  
  getSpecialHours: async (restaurantId: string, options: any = {}) => {
    const queryParams = new URLSearchParams();
    
    if (options.from_date) {
      queryParams.append('from_date', options.from_date);
    }
    
    if (options.to_date) {
      queryParams.append('to_date', options.to_date);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/availability/restaurants/${restaurantId}/special-hours${queryString}`, 'GET');
  },
  
  setSpecialHours: async (restaurantId: string, specialHours: any) => {
    return apiRequest(`/availability/restaurants/${restaurantId}/special-hours`, 'POST', specialHours);
  },
  
  deleteSpecialHours: async (restaurantId: string, specialHoursId: string) => {
    return apiRequest(`/availability/restaurants/${restaurantId}/special-hours/${specialHoursId}`, 'DELETE');
  }
};

// Order functions
export const orderApi = {
  getAll: async () => {
    return apiRequest('/orders');
  },
  
  getById: async (id: string) => {
    return apiRequest(`/orders/${id}`);
  },
  
  create: async (orderData: any) => {
    return apiRequest('/orders', 'POST', orderData);
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/orders/${id}`, 'PATCH', data);
  },
  
  addSpecialInstructions: async (id: string, instructions: string) => {
    return apiRequest(`/orders/${id}`, 'PATCH', { delivery_instructions: instructions });
  }
};

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

// Default export for the entire API client
const apiClient = {
  auth: authApi,
  restaurants: restaurantApi,
  orders: orderApi,
  payments: paymentApi,
  cashback: cashbackApi
};

export default apiClient;
