
import { useState, useEffect, useCallback } from 'react';
import apiService, { User, LoginRequest, RegisterRequest } from '../services/apiService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = apiService.getToken();
        if (token) {
          const user = await apiService.getProfile();
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiService.clearToken();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await apiService.login(credentials);
      apiService.setToken(response.access_token);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await apiService.register(userData);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true, user: response.user };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    apiService.clearToken();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      if (!authState.user) throw new Error('No user logged in');
      const updatedUser = await apiService.updateUser(authState.user.id, userData);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      return { success: true, user: updatedUser };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      };
    }
  }, [authState.user]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };
};
