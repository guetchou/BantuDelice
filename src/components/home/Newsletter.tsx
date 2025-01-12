import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Abonnement réussi",
      description: "Vous recevrez nos offres exclusives par email",
    });
  };

  return (
    <section className="py-16 bg-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Restez Informé</h2>
          <p className="mb-8">
            Inscrivez-vous à notre newsletter pour nos offres exclusives
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre email"
              className="bg-white text-black"
              required
            />
            <Button type="submit" className="bg-white text-indigo-600 hover:bg-gray-100">
              S'inscrire
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;