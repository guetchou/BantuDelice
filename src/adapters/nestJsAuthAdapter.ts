
import { nestAuthApi } from '@/integrations/api/nestjs-client';
import { supabase } from '@/integrations/supabase/client';

// This adapter bridges the NestJS authentication with existing Supabase auth
export const nestJsAuthAdapter = {
  /**
   * Authenticates with both NestJS and Supabase
   */
  signIn: async (email: string, password: string) => {
    try {
      // First try to authenticate with NestJS
      const nestResult = await nestAuthApi.login(email, password);
      
      // Then authenticate with Supabase for backward compatibility
      const supabaseResult = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (supabaseResult.error) {
        throw supabaseResult.error;
      }
      
      return { 
        data: {
          user: supabaseResult.data.user,
          nestToken: nestResult.token
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
   * Registers with both NestJS and Supabase
   */
  signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      // Register with NestJS first
      const nestResult = await nestAuthApi.register(email, password, firstName, lastName);
      
      // Then register with Supabase for backward compatibility
      const supabaseResult = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (supabaseResult.error) {
        throw supabaseResult.error;
      }
      
      return { 
        data: {
          user: supabaseResult.data.user,
          nestToken: nestResult.token
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
   * Signs out from both systems
   */
  signOut: async () => {
    // Sign out from NestJS
    nestAuthApi.logout();
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    return { error: null };
  }
};
