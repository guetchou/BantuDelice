
import { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '@/types/user';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean; // Add missing isAuthenticated
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Add missing logout alias for signOut
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAuthenticated: false, // Initialize the missing property
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  logout: async () => {}, // Add missing logout alias
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Simulate fetch user from local storage or API
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // This is just a mock implementation
      console.log('Signing in with:', { email, password });
      
      // Create a mock user
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        role: 'user',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      // This is just a mock implementation
      console.log('Signing up with:', { email, password, userData });
      
      // Create a mock user
      const mockUser: User = {
        id: '1',
        email,
        ...userData,
        role: 'user',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Alias for signOut to fix the missing logout property
  const logout = signOut;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user, // Add isAuthenticated property based on user presence
        signIn,
        signUp,
        signOut,
        logout, // Add logout alias
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
