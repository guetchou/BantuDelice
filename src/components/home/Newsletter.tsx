import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    // Success notification
    toast({
      title: "Abonnement réussi",
      description: "Vous recevrez nos offres exclusives par email",
    });
    
    // Reset form
    setEmail("");
  };

  return (
    <section className="py-20 bg-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Restez Informé</h2>
          <p className="text-lg mb-8 text-white/90">
            Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives
            et découvrir nos nouveautés en avant-première.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-white text-indigo-600 hover:bg-gray-100 whitespace-nowrap px-8">
              S'inscrire
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;