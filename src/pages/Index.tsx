import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Truck, CreditCard, MapPin, Star, ShoppingCart, Car, Calendar, Package, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch featured restaurants
  const { data: featuredRestaurants } = useQuery({
    queryKey: ['featuredRestaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .limit(3);
      
      if (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
      }
      return data;
    }
  });

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Abonnement réussi",
      description: "Vous recevrez nos offres exclusives par email",
    });
  };

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Commandez vos repas préférés en un seul clic !
        </h1>
        <p className="text-xl mb-8">
          Livraison rapide, repas chauds et savoureux directement chez vous.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/restaurants')}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Commander Maintenant
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/restaurants')}
            className="border-white text-white hover:bg-white/10"
          >
            Découvrir nos Services
          </Button>
        </div>
      </section>

      {/* Essential Services Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos Services Essentiels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Commande de Repas</h3>
            <p className="text-gray-600 mb-4">
              Vos plats préférés livrés chauds et rapidement
            </p>
            <Button onClick={() => navigate('/restaurants')}>Commander</Button>
          </Card>
          
          <Card className="p-6 text-center">
            <Car className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Réservation de Taxi</h3>
            <p className="text-gray-600 mb-4">
              Voyagez en toute tranquillité et confort
            </p>
            <Button variant="outline">Réserver</Button>
          </Card>
          
          <Card className="p-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Réservation de Gaz</h3>
            <p className="text-gray-600 mb-4">
              Approvisionnement rapide et sécurisé
            </p>
            <Button variant="outline">Commander</Button>
          </Card>
        </div>
      </section>

      {/* Complementary Services Section */}
      <section className="py-16 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">
          Services Complémentaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <Card className="p-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Livraison de Colis</h3>
            <p className="text-gray-600">
              Expédition rapide et sécurisée
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Ticket className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Réservation de Billets</h3>
            <p className="text-gray-600">
              Bus, train, avion, bateaux
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Autres Services</h3>
            <p className="text-gray-600">
              Découvrez nos services personnalisés
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Ce que nos clients disent
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Marie Dupont",
              comment: "Service rapide et repas toujours délicieux !"
            },
            {
              name: "Jean Martin",
              comment: "Le service était ponctuel et la nourriture très professionnelle"
            },
            {
              name: "Jean Martin",
              comment: "Livraison de gaz rapide et sans complications"
            },
            {
              name: "Sophie Lefebvre",
              comment: "Service rapide et sans complications"
            }
          ].map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{testimonial.comment}</p>
              <p className="font-semibold">{testimonial.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-purple-600 text-white rounded-lg mb-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Restez Informé</h2>
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
            <Button type="submit" className="bg-white text-purple-600 hover:bg-gray-100">
              S'inscrire
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;