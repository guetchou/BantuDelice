
import { mockData } from '@/utils/mockData';

// This adapter bridges authentication with your custom backend
export const nestJsAuthAdapter = {
  /**
   * Authenticates with the backend
   */
  signIn: async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = await mockData.mockApi.auth.signInWithPassword({ email, password });
      
      return { 
        data: {
          user: result.data.user,
          nestToken: 'mock-backend-token-xyz'
        },
        error: null 
      };
    } catch (error) {
      console.error("Authentication error:", error);
      // Return error in the expected format
      return { data: null, error };
    }
  },
  
  /**
   * Registers with the backend
   */
  signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await mockData.mockApi.auth.signUp({
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      return { 
        data: {
          user: result.data.user,
          nestToken: 'mock-backend-token-xyz'
        },
        error: null
      };
    } catch (error) {
      console.error("Registration error:", error);
      // Return error in the expected format
      return { data: null, error };
    }
  },
  
  /**
   * Signs out from the system
   */
  signOut: async () => {
    // Simulate sign out
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { error: null };
  }
};
