
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuthStateHandler } from "@/hooks/useAuthStateHandler";

const Auth = () => {
  const {
    error,
    isRegistering,
    isLoading,
    isForgotPassword,
    setIsRegistering,
    setIsForgotPassword,
    setError,
    handleForgotPassword
  } = useAuthStateHandler();

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
      subtitle={
        isForgotPassword 
          ? "Réinitialisation du mot de passe"
          : isRegistering 
            ? "Créez votre compte" 
            : "Connectez-vous pour continuer"
      }
    >
      {(isRegistering || isForgotPassword) && (
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => {
            setIsRegistering(false);
            setIsForgotPassword(false);
            setError(null);
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      )}

      <ErrorAlert error={error} />
      
      <AnimatePresence mode="wait">
        {isForgotPassword ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Entrez votre adresse email pour recevoir les instructions de réinitialisation.
            </p>
            <ForgotPasswordForm onSubmit={handleForgotPassword} />
          </div>
        ) : isRegistering ? (
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
            onForgotPassword={() => setIsForgotPassword(true)}
          />
        )}
      </AnimatePresence>
    </AuthContainer>
  );
};

export default Auth;
