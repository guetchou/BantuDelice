
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for localStorage token management
export const tokenStorage = {
  get: () => localStorage.getItem('auth_token'),
  set: (token: string) => localStorage.setItem('auth_token', token),
  remove: () => localStorage.removeItem('auth_token')
};

// Helper for making authenticated requests
export const apiRequest = async (
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
