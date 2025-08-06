import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

// Types pour une authentification enterprise-grade
interface EnterpriseUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  permissions: string[];
  profile: {
    avatar?: string;
    preferences: Record<string, any>;
    lastLogin: string;
    loginCount: number;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    failedLoginAttempts: number;
    accountLocked: boolean;
  };
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

interface EnterpriseAuthContextType {
  user: EnterpriseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Méthodes d'authentification
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  
  // Sécurité
  enableTwoFactor: () => Promise<boolean>;
  disableTwoFactor: () => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  
  // Gestion de session
  updateProfile: (updates: Partial<EnterpriseUser>) => Promise<boolean>;
  getSessionInfo: () => SessionInfo;
}

interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
}

interface AuthResult {
  success: boolean;
  user?: EnterpriseUser;
  error?: string;
  requiresTwoFactor?: boolean;
  sessionExpiresIn?: number;
}

interface SessionInfo {
  isActive: boolean;
  expiresAt: Date;
  lastActivity: Date;
  deviceInfo: {
    userAgent: string;
    ipAddress?: string;
    location?: string;
  };
}

// Configuration de sécurité
const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 jours
  passwordMinLength: 8,
  requireSpecialChars: true,
  requireNumbers: true,
  requireUppercase: true,
};

// Service de stockage sécurisé
class SecureStorage {
  private static readonly PREFIX = 'bantudelice_secure_';
  
  static set(key: string, value: unknown, encrypted = true): void {
    const fullKey = this.PREFIX + key;
    const data = encrypted ? this.encrypt(JSON.stringify(value)) : JSON.stringify(value);
    sessionStorage.setItem(fullKey, data);
  }
  
  static get(key: string, encrypted = true): unknown {
    const fullKey = this.PREFIX + key;
    const data = sessionStorage.getItem(fullKey);
    if (!data) return null;
    
    try {
      const decrypted = encrypted ? this.decrypt(data) : data;
      return JSON.parse(decrypted);
    } catch {
      this.remove(key);
      return null;
    }
  }
  
  static remove(key: string): void {
    const fullKey = this.PREFIX + key;
    sessionStorage.removeItem(fullKey);
  }
  
  static clear(): void {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  }
  
  // Chiffrement simple (en production, utiliser une bibliothèque robuste)
  private static encrypt(text: string): string {
    return btoa(text); // Base64 pour l'exemple
  }
  
  private static decrypt(encrypted: string): string {
    return atob(encrypted); // Base64 pour l'exemple
  }
}

// Service de validation
class ValidationService {
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < SECURITY_CONFIG.passwordMinLength) {
      errors.push(`Le mot de passe doit contenir au moins ${SECURITY_CONFIG.passwordMinLength} caractères`);
    }
    
    if (SECURITY_CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (SECURITY_CONFIG.requireNumbers && !/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (SECURITY_CONFIG.requireSpecialChars && !/[!@#$%^&*(),.?": Record<string, unknown>|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Service de gestion des tentatives de connexion
class LoginAttemptService {
  private static readonly ATTEMPTS_KEY = 'login_attempts';
  private static readonly LOCKOUT_KEY = 'account_locked_until';
  
  static recordFailedAttempt(email: string): void {
    const attempts = this.getFailedAttempts(email);
    attempts.count++;
    attempts.lastAttempt = Date.now();
    
    SecureStorage.set(`${this.ATTEMPTS_KEY}_${email}`, attempts);
    
    if (attempts.count >= SECURITY_CONFIG.maxLoginAttempts) {
      this.lockAccount(email);
    }
  }
  
  static recordSuccessfulAttempt(email: string): void {
    SecureStorage.remove(`${this.ATTEMPTS_KEY}_${email}`);
    SecureStorage.remove(`${this.LOCKOUT_KEY}_${email}`);
  }
  
  static isAccountLocked(email: string): boolean {
    const lockoutUntil = SecureStorage.get(`${this.LOCKOUT_KEY}_${email}`);
    if (!lockoutUntil) return false;
    
    if (Date.now() > lockoutUntil) {
      SecureStorage.remove(`${this.LOCKOUT_KEY}_${email}`);
      return false;
    }
    
    return true;
  }
  
  private static getFailedAttempts(email: string): { count: number; lastAttempt: number } {
    return SecureStorage.get(`${this.ATTEMPTS_KEY}_${email}`) || { count: 0, lastAttempt: 0 };
  }
  
  private static lockAccount(email: string): void {
    const lockoutUntil = Date.now() + SECURITY_CONFIG.lockoutDuration;
    SecureStorage.set(`${this.LOCKOUT_KEY}_${email}`, lockoutUntil);
  }
}

// Contexte d'authentification enterprise
const EnterpriseAuthContext = createContext<EnterpriseAuthContextType | undefined>(undefined);

export const useEnterpriseAuth = () => {
  const context = useContext(EnterpriseAuthContext);
  if (!context) {
    throw new Error('useEnterpriseAuth must be used within an EnterpriseAuthProvider');
  }
  return context;
};

export const EnterpriseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<EnterpriseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialisation au démarrage
  useEffect(() => {
    initializeAuth();
  }, []);

  // Gestion automatique du refresh token
  useEffect(() => {
    if (user && refreshTimer) {
      const timeUntilRefresh = SECURITY_CONFIG.sessionTimeout - 5 * 60 * 1000; // 5 min avant expiration
      const timer = setTimeout(() => {
        refreshAuth();
      }, timeUntilRefresh);
      
      setRefreshTimer(timer);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const initializeAuth = async () => {
    try {
      const tokens = SecureStorage.get('auth_tokens');
      if (tokens && tokens.refreshToken) {
        const success = await refreshAuth();
        if (!success) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      // Vérifier si le compte est verrouillé
      if (LoginAttemptService.isAccountLocked(credentials.email)) {
        return {
          success: false,
          error: 'Compte temporairement verrouillé. Réessayez dans 15 minutes.'
        };
      }

      // Valider les entrées
      if (!ValidationService.validateEmail(credentials.email)) {
        return {
          success: false,
          error: 'Adresse email invalide'
        };
      }

      // Appel API avec gestion d'erreurs robuste
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.0.0',
          'X-Device-Id': getDeviceId(),
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Gérer les tentatives échouées
        LoginAttemptService.recordFailedAttempt(credentials.email);
        
        return {
          success: false,
          error: errorData.message || 'Identifiants invalides'
        };
      }

      const data = await response.json();
      
      // Enregistrer la tentative réussie
      LoginAttemptService.recordSuccessfulAttempt(credentials.email);
      
      // Stocker les tokens de manière sécurisée
      const tokens: AuthTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || data.access_token,
        expiresIn: data.expires_in || SECURITY_CONFIG.sessionTimeout,
        tokenType: 'Bearer'
      };
      
      SecureStorage.set('auth_tokens', tokens);
      setUser(data.user);
      
      // Configurer le refresh automatique
      setupAutoRefresh(tokens.expiresIn);
      
      toast.success(`Bienvenue, ${data.user.name}!`);
      
      return {
        success: true,
        user: data.user,
        sessionExpiresIn: tokens.expiresIn
      };
      
    } catch (error) {
      console.error('Login error:', error);
      LoginAttemptService.recordFailedAttempt(credentials.email);
      
      return {
        success: false,
        error: 'Erreur de connexion. Veuillez réessayer.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      // Validation robuste
      if (!ValidationService.validateEmail(userData.email)) {
        return {
          success: false,
          error: 'Adresse email invalide'
        };
      }

      const passwordValidation = ValidationService.validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', ')
        };
      }

      if (!userData.acceptTerms) {
        return {
          success: false,
          error: 'Vous devez accepter les conditions d\'utilisation'
        };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.0.0',
          'X-Device-Id': getDeviceId(),
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || 'Erreur lors de l\'inscription'
        };
      }

      const data = await response.json();
      
      // Stocker les tokens
      const tokens: AuthTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || data.access_token,
        expiresIn: data.expires_in || SECURITY_CONFIG.sessionTimeout,
        tokenType: 'Bearer'
      };
      
      SecureStorage.set('auth_tokens', tokens);
      setUser(data.user);
      
      setupAutoRefresh(tokens.expiresIn);
      
      toast.success('Compte créé avec succès!');
      
      return {
        success: true,
        user: data.user
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'inscription. Veuillez réessayer.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Appel API pour invalider le token côté serveur
      const tokens = SecureStorage.get('auth_tokens');
      if (tokens?.accessToken) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {}); // Ignorer les erreurs lors de la déconnexion
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Nettoyer le stockage local
      SecureStorage.clear();
      setUser(null);
      
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }
      
      toast.info('Vous avez été déconnecté');
    }
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const tokens = SecureStorage.get('auth_tokens');
      if (!tokens?.refreshToken) {
        return false;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.0.0',
          'X-Device-Id': getDeviceId(),
        },
        body: JSON.stringify({
          refresh_token: tokens.refreshToken
        }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      const newTokens: AuthTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || tokens.refreshToken,
        expiresIn: data.expires_in || SECURITY_CONFIG.sessionTimeout,
        tokenType: 'Bearer'
      };
      
      SecureStorage.set('auth_tokens', newTokens);
      setUser(data.user);
      
      setupAutoRefresh(newTokens.expiresIn);
      
      return true;
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const setupAutoRefresh = (expiresIn: number) => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
    
    const timeUntilRefresh = expiresIn - 5 * 60 * 1000; // 5 min avant expiration
    const timer = setTimeout(() => {
      refreshAuth();
    }, timeUntilRefresh);
    
    setRefreshTimer(timer);
  };

  const getDeviceId = (): string => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };

  const getSessionInfo = (): SessionInfo => {
    const tokens = SecureStorage.get('auth_tokens');
    return {
      isActive: !!tokens?.accessToken,
      expiresAt: tokens ? new Date(Date.now() + tokens.expiresIn) : new Date(),
      lastActivity: new Date(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        ipAddress: undefined, // Sera fourni par le serveur
        location: undefined, // Sera fourni par le serveur
      }
    };
  };

  // Méthodes de sécurité (à implémenter selon les besoins)
  const enableTwoFactor = async (): Promise<boolean> => {
    // Implémentation 2FA
    return false;
  };

  const disableTwoFactor = async (): Promise<boolean> => {
    // Implémentation 2FA
    return false;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    // Implémentation changement de mot de passe
    return false;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Implémentation reset de mot de passe
    return false;
  };

  const updateProfile = async (updates: Partial<EnterpriseUser>): Promise<boolean> => {
    // Implémentation mise à jour de profil
    return false;
  };

  const value: EnterpriseAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    refreshAuth,
    enableTwoFactor,
    disableTwoFactor,
    changePassword,
    resetPassword,
    updateProfile,
    getSessionInfo,
  };

  return (
    <EnterpriseAuthContext.Provider value={value}>
      {children}
    </EnterpriseAuthContext.Provider>
  );
}; 