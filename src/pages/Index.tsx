import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, CreditCard, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Livraison de repas rapide et fiable
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Découvrez les meilleurs restaurants près de chez vous
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/restaurants')}
          className="bg-primary hover:bg-primary/90"
        >
          Commander maintenant
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi nous choisir ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Livraison rapide</h3>
            <p className="text-gray-600">
              Livraison en 30 minutes ou moins
            </p>
          </Card>
          <Card className="p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Suivi en temps réel</h3>
            <p className="text-gray-600">
              Suivez votre commande en temps réel
            </p>
          </Card>
          <Card className="p-6 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Paiement sécurisé</h3>
            <p className="text-gray-600">
              Transactions sécurisées garanties
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 rounded-lg my-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Ce que disent nos clients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Service excellent et livraison rapide. Je recommande vivement !"
              </p>
              <p className="font-semibold">Client satisfait {i}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Prêt à commander ?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Découvrez une large sélection de restaurants près de chez vous
        </p>
        <Button 
          size="lg"
          onClick={() => navigate('/restaurants')}
          className="bg-primary hover:bg-primary/90"
        >
          Voir les restaurants
        </Button>
      </section>
    </div>
  );
};

export default Index;