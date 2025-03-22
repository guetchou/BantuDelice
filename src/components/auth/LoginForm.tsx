
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onRegister: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onRegister, onForgotPassword }: LoginFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

      <Card className="p-6">
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Adresse email
              </label>
              <Input
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </div>
        </form>
      </Card>

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
