
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

// Default export for the entire API client
const apiClient = {
  auth: authApi,
  restaurants: restaurantApi,
  orders: orderApi
};

export default apiClient;
