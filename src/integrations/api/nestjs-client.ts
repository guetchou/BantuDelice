
/**
 * NestJS API client for authentication and data operations
 */
import { toast } from "sonner";

// Use environment variable or default to localhost during development
const NESTJS_API_URL = import.meta.env.VITE_NESTJS_API_URL || 'http://localhost:3000/api';

// Helper for localStorage token management
const nestTokenStorage = {
  get: () => localStorage.getItem('nest_auth_token'),
  set: (token: string) => localStorage.setItem('nest_auth_token', token),
  remove: () => localStorage.removeItem('nest_auth_token')
};

// Helper for making authenticated requests to NestJS backend
const nestApiRequest = async (
  endpoint: string, 
  method: string = 'GET', 
  data: any = null, 
  requiresAuth: boolean = true
) => {
  try {
    const url = `${NESTJS_API_URL}${endpoint}`;
    const token = nestTokenStorage.get();
    
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
      throw new Error(responseData.message || responseData.error || 'Something went wrong');
    }
    
    return responseData;
  } catch (error) {
    console.error('NestJS API request error:', error);
    
    // Show toast notification for errors
    if (error instanceof Error) {
      toast.error(error.message);
    }
    
    throw error;
  }
};

// Auth functions for NestJS
export const nestAuthApi = {
  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    const data = await nestApiRequest('/auth/register', 'POST', {
      email,
      password,
      firstName,
      lastName
    }, false);
    
    if (data.token) {
      nestTokenStorage.set(data.token);
    }
    
    return data;
  },
  
  login: async (email: string, password: string) => {
    const data = await nestApiRequest('/auth/login', 'POST', { email, password }, false);
    
    if (data.token) {
      nestTokenStorage.set(data.token);
    }
    
    return data;
  },
  
  logout: () => {
    nestTokenStorage.remove();
  },
  
  getUser: async () => {
    const token = nestTokenStorage.get();
    if (!token) return null;
    
    try {
      const data = await nestApiRequest('/auth/me');
      return data.user;
    } catch (error) {
      // If authentication fails, clear the token
      nestTokenStorage.remove();
      return null;
    }
  },
  
  isAuthenticated: () => {
    return !!nestTokenStorage.get();
  }
};

// Employee functions for the NestJS backend
export const nestEmployeeApi = {
  getAll: async () => {
    return nestApiRequest('/employees');
  },
  
  getById: async (id: string) => {
    return nestApiRequest(`/employees/${id}`);
  },
  
  create: async (employeeData: any) => {
    return nestApiRequest('/employees', 'POST', employeeData);
  },
  
  update: async (id: string, employeeData: any) => {
    return nestApiRequest(`/employees/${id}`, 'PATCH', employeeData);
  },
  
  delete: async (id: string) => {
    return nestApiRequest(`/employees/${id}`, 'DELETE');
  }
};

// Default export for the NestJS API client
const nestApiClient = {
  auth: nestAuthApi,
  employees: nestEmployeeApi
};

export default nestApiClient;
