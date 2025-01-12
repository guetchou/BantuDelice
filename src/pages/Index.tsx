import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Star, ShoppingCart, Taxi, GasPump, Package, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Abonnement réussi",
      description: "Vous recevrez nos offres exclusives par email",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[500px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(67, 56, 202, 0.7), rgba(67, 56, 202, 0.7)), url('/lovable-uploads/2f9ae645-27e1-4ec7-9c41-fdf77f804023.png')`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Commandez vos repas préférés en un seul clic !
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Livraison rapide, repas chauds et savoureux directement chez vous.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate('/restaurants')}
              >
                Commander Maintenant
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                Découvrir nos Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos Services Essentiels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Commande de Repas</h3>
              <p className="text-gray-600 mb-4">
                Vos plats préférés livrés chauds et rapidement
              </p>
              <Button onClick={() => navigate('/restaurants')}>Commander</Button>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Taxi className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Réservation de Taxis</h3>
              <p className="text-gray-600 mb-4">
                Voyagez en toute tranquillité et confort
              </p>
              <Button variant="outline">Réserver</Button>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <GasPump className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Réservation de Gaz</h3>
              <p className="text-gray-600 mb-4">
                Approvisionnement rapide et sécurisé
              </p>
              <Button variant="outline">Commander</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Complementary Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Services Complémentaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Package className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Livraison de Colis</h3>
              <p className="text-gray-600">
                Expédition rapide et sécurisée
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Ticket className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Réservation de Billets</h3>
              <p className="text-gray-600">
                Bus, train, avion, bateaux
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Star className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Autres Services</h3>
              <p className="text-gray-600">
                Découvrez nos services personnalisés
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ce que nos clients disent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                  <div>
                    <h4 className="font-semibold">Client {i}</h4>
                    <div className="flex text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Service rapide et repas toujours délicieux !"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
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

      <Footer />
    </div>
  );
};

export default Index;