
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import pb from '@/lib/pocketbase';
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

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      logger.info("État d'authentification changé:", { sessionExists: !!model });
      
      if (token && model) {
        logger.info("Utilisateur connecté, redirection vers l'accueil");
        toast.success("Connexion réussie !");
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from);
      }
      
      if (!token && !model) {
        logger.info("Utilisateur déconnecté");
        setError(null);
      }
    });

    return () => {
      logger.info("Nettoyage des écouteurs d'authentification");
      unsubscribe();
    };
  }, [navigate, location]);

  const checkSession = async () => {
    try {
      // Check if there's an active session
      if (pb.authStore.isValid) {
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

  const handleError = (error: Error) => {
    logger.error("Erreur d'authentification détaillée:", { 
      message: error.message
    });

    const errorMsg = error.message.toLowerCase();
    
    if (errorMsg.includes('invalid email or password')) {
      setError("Identifiants invalides. Veuillez vérifier votre email et mot de passe.");
    } else if (errorMsg.includes('email not confirmed')) {
      setError("Veuillez confirmer votre email avant de vous connecter.");
    } else if (errorMsg.includes('user not found')) {
      setError("Aucun utilisateur trouvé avec ces identifiants.");
    } else if (errorMsg.includes('invalid email')) {
      setError("L'adresse email n'est pas valide.");
    } else {
      setError(error.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await pb.collection('users').requestPasswordReset(email);
      
      toast.success("Instructions de réinitialisation envoyées par email");
      setIsForgotPassword(false);
    } catch (error) {
      if (error instanceof Error) {
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
