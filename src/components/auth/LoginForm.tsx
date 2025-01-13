import { motion } from "framer-motion";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  onRegister: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onRegister, onForgotPassword }: LoginFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-sm text-gray-300 mb-4">
        <p>Exigences du mot de passe :</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Minimum 8 caractères</li>
          <li>Au moins une majuscule</li>
          <li>Au moins un chiffre</li>
          <li>Au moins un caractère spécial</li>
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
            }
          }
        }}
      />

      <div className="space-y-2 mt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onRegister}
        >
          Créer un compte
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className="w-full text-sm"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </Button>
      </div>
    </motion.div>
  );
};