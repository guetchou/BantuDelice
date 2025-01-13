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

const Auth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    logger.info("Page d'authentification chargée");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info("État d'authentification changé:", { event, sessionExists: !!session });
      
      if (event === "SIGNED_IN" && session) {
        logger.info("Utilisateur connecté, redirection vers l'accueil");
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        logger.info("Utilisateur déconnecté");
        setError(null);
      }
      if (event === "PASSWORD_RECOVERY") {
        setError("Un email de récupération a été envoyé.");
      }

      const authError = (session as any)?.error;
      if (authError) {
        logger.error("Erreur d'authentification:", { error: authError });
        handleError(authError as AuthError);
      }
    });

    checkSession();

    return () => {
      logger.info("Nettoyage des écouteurs d'authentification");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkSession = async () => {
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

  return (
    <AuthContainer 
      title="Buntudelice"
      subtitle={isRegistering ? "Créez votre compte" : "Connectez-vous pour continuer"}
    >
      <ErrorAlert error={error} />
      <AnimatePresence mode="wait">
        {isRegistering ? (
          <RegistrationForm onCancel={() => setIsRegistering(false)} />
        ) : (
          <LoginForm onRegister={() => setIsRegistering(true)} />
        )}
      </AnimatePresence>
    </AuthContainer>
  );
};

export default Auth;