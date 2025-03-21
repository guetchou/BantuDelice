
import { toast } from "sonner";
import { apiRequest, tokenStorage } from "./core";

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
