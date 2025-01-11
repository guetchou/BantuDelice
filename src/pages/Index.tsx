import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Truck, CreditCard, MapPin, Star } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (value: boolean) => void }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80)',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Commandez vos repas préférés en un seul clic !
          </h1>
          <p className="text-xl mb-8">
            Livraison rapide, repas chauds et savoureux directement chez vous.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/menu")}
            >
              Commander Maintenant
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 hover:bg-white/20"
            >
              Découvrir nos Services
            </Button>
          </div>
        </div>
      </section>

      {/* Services Essentiels */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Nos Services Essentiels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Commande de Repas"
              description="Vos plats préférés livrés chauds et rapidement"
              icon={<Truck className="h-8 w-8" />}
              action={() => navigate("/menu")}
            />
            <ServiceCard
              title="Réservation de Taxis"
              description="Voyagez en toute tranquillité et confort"
              icon={<MapPin className="h-8 w-8" />}
              action={() => navigate("/taxis")}
            />
            <ServiceCard
              title="Paiement Sécurisé"
              description="Transactions sûres et rapides"
              icon={<CreditCard className="h-8 w-8" />}
              action={() => navigate("/payment")}
            />
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Ce que nos clients disent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Marie Dupont"
              comment="Service rapide et repas toujours délicieux !"
              rating={5}
            />
            <TestimonialCard
              name="Jean Martin"
              comment="La livraison est ponctuelle et le conducteur très professionnel."
              rating={5}
            />
            <TestimonialCard
              name="Sophie Lefebvre"
              comment="Application facile à utiliser et service client réactif."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-primary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Restez Informé
          </h2>
          <p className="text-gray-300 mb-8">
            Inscrivez-vous à notre newsletter pour nos offres exclusives.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Votre email"
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="bg-primary hover:bg-primary/90">
              S'inscrire
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  action 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  action: () => void;
}) => (
  <Card className="p-6 glass-effect hover-scale animate-fade-in cursor-pointer" onClick={action}>
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </Card>
);

const TestimonialCard = ({ 
  name, 
  comment, 
  rating 
}: { 
  name: string; 
  comment: string; 
  rating: number;
}) => (
  <Card className="p-6 glass-effect">
    <div className="flex items-center mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-300 mb-4">{comment}</p>
    <p className="font-semibold text-white">{name}</p>
  </Card>
);

export default Index;