
import { apiRequest } from "./core";

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
