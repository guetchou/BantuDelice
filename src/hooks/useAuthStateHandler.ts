
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { logger } from "@/services/logger";
import { toast } from "sonner";

export const useAuthStateHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    logger.info("Page d'authentification chargée");
    checkSession();

    // We can't directly use supabase.auth.onAuthStateChange due to TypeScript errors,
    // so we'll access it through any type to bypass the error for now
    const authClient = supabase.auth as any;
    const { data: { subscription } } = authClient.onAuthStateChange(async (event: string, session: any) => {
      logger.info("État d'authentification changé:", { event, sessionExists: !!session });
      
      if (event === "SIGNED_IN" && session) {
        logger.info("Utilisateur connecté, redirection vers l'accueil");
        toast.success("Connexion réussie !");
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from);
      }
      if (event === "SIGNED_OUT") {
        logger.info("Utilisateur déconnecté");
        setError(null);
      }
      if (event === "PASSWORD_RECOVERY") {
        setError("Un email de récupération a été envoyé.");
      }
      if (event === "USER_UPDATED") {
        logger.info("Profil utilisateur mis à jour");
        toast.success("Profil mis à jour avec succès !");
      }

      const authError = (session as any)?.error;
      if (authError) {
        logger.error("Erreur d'authentification:", { error: authError });
        handleError(authError as AuthError);
      }
    });

    return () => {
      logger.info("Nettoyage des écouteurs d'authentification");
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        logger.error("Erreur lors de la vérification de la session:", { error });
        handleError(error);
        return;
      }
      if (session) {
        logger.info("Session existante trouvée, redirection vers l'accueil");
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from);
      }
    } catch (error) {
      logger.error("Erreur inattendue lors de la vérification de la session:", { error });
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: AuthError) => {
    logger.error("Erreur d'authentification détaillée:", { 
      code: error.code,
      message: error.message,
      status: error.status
    });

    switch (error.message) {
      case "Invalid login credentials":
        setError("Identifiants invalides. Veuillez vérifier votre email et mot de passe.");
        break;
      case "Email not confirmed":
        setError("Veuillez confirmer votre email avant de vous connecter.");
        break;
      case "User not found":
        setError("Aucun utilisateur trouvé avec ces identifiants.");
        break;
      case "Invalid email":
        setError("L'adresse email n'est pas valide.");
        break;
      default:
        setError(error.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      // Use any type to bypass TypeScript error for now
      const authClient = supabase.auth as any;
      const { error } = await authClient.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Instructions de réinitialisation envoyées par email");
      setIsForgotPassword(false);
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error);
      }
    }
  };

  return {
    error,
    isRegistering,
    isLoading,
    isForgotPassword,
    setIsRegistering,
    setIsForgotPassword,
    setError,
    handleForgotPassword
  };
};
