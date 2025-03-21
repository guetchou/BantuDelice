
import { apiRequest } from "./core";

// Types
export interface OrderCreateData {
  restaurant_id: string;
  delivery_address: string;
  delivery_instructions?: string;
  delivery_coordinates?: [number, number];
  items: Array<{
    id: string;
    quantity: number;
    options?: Array<{id: string; name: string; value: string; price: number}>;
  }>;
  payment_method: string;
  promo_code?: string;
  user_contact?: string;
}

export interface OrderUpdateData {
  status?: string;
  payment_status?: string;
  delivery_status?: string;
  delivery_instructions?: string;
  estimated_delivery_time?: string;
  driver_id?: string;
}

// Order functions
export const orderApi = {
  getAll: async () => {
    return apiRequest('/orders');
  },
  
  getByStatus: async (status: string) => {
    return apiRequest(`/orders?status=${status}`);
  },
  
  getById: async (id: string) => {
    return apiRequest(`/orders/${id}`);
  },
  
  create: async (orderData: OrderCreateData) => {
    return apiRequest('/orders', 'POST', orderData);
  },
  
  update: async (id: string, data: OrderUpdateData) => {
    return apiRequest(`/orders/${id}`, 'PATCH', data);
  },
  
  cancel: async (id: string, reason: string) => {
    return apiRequest(`/orders/${id}/cancel`, 'POST', { reason });
  },
  
  addSpecialInstructions: async (id: string, instructions: string) => {
    return apiRequest(`/orders/${id}`, 'PATCH', { delivery_instructions: instructions });
  },
  
  trackDelivery: async (id: string) => {
    return apiRequest(`/orders/${id}/tracking`);
  },
  
  rateDelivery: async (id: string, rating: number, comment?: string) => {
    return apiRequest(`/orders/${id}/rate`, 'POST', { rating, comment });
  },
  
  getHistory: async (limit: number = 10, offset: number = 0) => {
    return apiRequest(`/orders/history?limit=${limit}&offset=${offset}`);
  },

  getReceipt: async (id: string) => {
    return apiRequest(`/orders/${id}/receipt`);
  }
};
