
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { nestAuthApi } from '@/integrations/api/nestjs-client';
import { toast } from 'sonner';

// Définition du context pour l'authentification
interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  nestToken: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [nestToken, setNestToken] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si un token NestJS existe dans le localStorage
    const savedNestToken = localStorage.getItem('nest_auth_token');
    if (savedNestToken) {
      setNestToken(savedNestToken);
    }

    // Configurer l'écouteur d'authentification de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);

      // Si l'utilisateur est connecté à Supabase mais pas à NestJS, essayons de récupérer un utilisateur depuis NestJS
      if (session?.user && !savedNestToken) {
        try {
          const userEmail = session.user.email;
          if (userEmail) {
            // Dans un cas réel, il faudrait probablement utiliser un token commun ou une autre méthode
            // Mais pour la démonstration, on tente simplement de récupérer l'état de l'utilisateur
            const nestUser = await nestAuthApi.getUser();
            if (nestUser) {
              // Stockage du token NestJS s'il est disponible
              const nestToken = localStorage.getItem('nest_auth_token');
              if (nestToken) {
                setNestToken(nestToken);
              }
            }
          }
        } catch (error) {
          console.error("Erreur lors de la synchronisation NestJS:", error);
        }
      }
    });

    // Initial session check
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setSession(data.session);
      setUser(data.session?.user || null);
    } catch (error) {
      console.error("Erreur lors de la vérification de la session:", error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      
      // Authentification avec NestJS d'abord
      const nestResult = await nestAuthApi.login(email, password);
      if (nestResult.token) {
        setNestToken(nestResult.token);
        localStorage.setItem('nest_auth_token', nestResult.token);
      }
      
      // Puis avec Supabase (pour la rétrocompatibilité)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      setUser(data.user);
      setSession(data.session);
      
      return { data, error: null };
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, metadata?: any) {
    try {
      setLoading(true);
      
      // Enregistrement avec NestJS d'abord
      const nestResult = await nestAuthApi.register(email, password, metadata?.first_name, metadata?.last_name);
      if (nestResult.token) {
        setNestToken(nestResult.token);
        localStorage.setItem('nest_auth_token', nestResult.token);
      }
      
      // Puis avec Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      if (error) throw error;
      
      setUser(data.user);
      setSession(data.session);
      
      return { data, error: null };
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      // Déconnexion de NestJS
      nestAuthApi.logout();
      setNestToken(null);
      localStorage.removeItem('nest_auth_token');
      
      // Déconnexion de Supabase
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      
      return { error: null };
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return { error };
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Instructions de réinitialisation envoyées par email");
      return { error: null };
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      return { error };
    }
  }

  async function updateProfile(data: any) {
    try {
      // Mettre à jour le profil dans Supabase
      const { error } = await supabase.auth.updateUser({
        data
      });
      
      if (error) throw error;
      
      // Rafraîchir l'utilisateur
      await checkSession();
      
      // Dans un cas réel, il faudrait également mettre à jour le profil dans NestJS
      // si nécessaire
      
      return { error: null };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      return { error };
    }
  }

  const value = {
    user,
    session,
    loading,
    nestToken,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
