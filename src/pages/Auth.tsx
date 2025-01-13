import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { logger } from "@/services/logger";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logger.info("Page d'authentification chargée");
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info("État d'authentification changé:", { event, sessionExists: !!session });
      
      if (event === "SIGNED_IN" && session) {
        logger.info("Utilisateur connecté, redirection vers l'accueil");
        toast.success("Connexion réussie !");
        navigate("/");
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
  }, [navigate]);

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
        navigate("/");
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

  if (isLoading) {
    return (
      <AuthContainer 
        title="Buntudelice"
        subtitle="Chargement..."
      >
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer 
      title="Buntudelice"
      subtitle={isRegistering ? "Créez votre compte" : "Connectez-vous pour continuer"}
    >
      <ErrorAlert error={error} />
      <AnimatePresence mode="wait">
        {isRegistering ? (
          <RegistrationForm 
            onCancel={() => setIsRegistering(false)}
            onSuccess={() => {
              toast.success("Inscription réussie ! Veuillez vérifier votre email.");
              setIsRegistering(false);
            }}
          />
        ) : (
          <LoginForm 
            onRegister={() => setIsRegistering(true)}
            onForgotPassword={() => {
              // Implement password reset logic here
              toast.info("Fonctionnalité à venir");
            }}
          />
        )}
      </AnimatePresence>
    </AuthContainer>
  );
};

export default Auth;