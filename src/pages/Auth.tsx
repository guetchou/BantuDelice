import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";
import { logger } from "@/services/logger";

const Auth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

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

      // Gestion des erreurs d'authentification
      const authError = (session as any)?.error;
      if (authError) {
        logger.error("Erreur d'authentification:", { error: authError });
        handleError(authError as AuthError);
      }
    });

    // Vérification de la session au chargement
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
      case "Signup requires a valid password":
        setError("Le mot de passe doit contenir au moins 6 caractères.");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 glass-effect">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Buntudelice
          </h1>
          <p className="text-gray-300 mt-2">Connectez-vous pour continuer</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-300 mb-4">
          <p>Exigences du mot de passe :</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Minimum 6 caractères</li>
          </ul>
        </div>

        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#10b981',
                  brandAccent: '#059669',
                }
              }
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours...',
                email_input_placeholder: 'Votre adresse email',
                password_input_placeholder: 'Votre mot de passe',
              },
              sign_up: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: "S'inscrire",
                loading_button_label: 'Inscription en cours...',
                email_input_placeholder: 'Votre adresse email',
                password_input_placeholder: 'Choisissez un mot de passe',
              }
            }
          }}
        />
      </Card>
    </div>
  );
};

export default Auth;