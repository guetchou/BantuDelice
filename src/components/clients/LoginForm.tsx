
import { useState } from "react";
import { login } from "@/services/pocketbaseService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await login(email, password);
      toast({
        title: "Connexion réussie",
        description: `Connecté en tant que ${user.record.email}`,
      });
    } catch (err) {
      toast({
        title: "Erreur de connexion",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Connexion</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <Input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </Card>
  );
}
