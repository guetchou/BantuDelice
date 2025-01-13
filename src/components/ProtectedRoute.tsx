import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logger";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        logger.info("Vérification de l'authentification:", { 
          isAuthenticated: !!session,
          path: location.pathname 
        });
        setIsAuthenticated(!!session);
      } catch (error) {
        logger.error("Erreur lors de la vérification de l'authentification:", { error });
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      logger.info("Changement d'état d'authentification:", { 
        isAuthenticated: !!session,
        path: location.pathname 
      });
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [location]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    logger.info("Redirection vers la page d'authentification:", { 
      from: location.pathname 
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};