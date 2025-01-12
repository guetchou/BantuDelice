import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Phone, Mail, Star, ShoppingCart, Car, Fuel, Package, 
  Ticket, Utensils, Home, Bike, ShoppingBag, Briefcase, Heart, Book,
  ChefHat, Building, GraduationCap, House, Doctor
} from "lucide-react";
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
      <section className="relative h-[500px] bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Découvrez la Cuisine Congolaise !
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Des plats authentiques et savoureux livrés directement chez vous.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100"
                onClick={() => navigate('/restaurants')}
              >
                Commander Maintenant
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                Découvrir nos Spécialités
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
                Vos plats congolais préférés livrés chauds
              </p>
              <Button onClick={() => navigate('/restaurants')}>Commander</Button>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Car className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Transport VIP</h3>
              <p className="text-gray-600 mb-4">
                Service de transport personnalisé
              </p>
              <Button variant="outline">Réserver</Button>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Fuel className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Livraison de Gaz</h3>
              <p className="text-gray-600 mb-4">
                Approvisionnement rapide et sécurisé
              </p>
              <Button variant="outline">Commander</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Services Additionnels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Traiteur Événementiel</h3>
              <p className="text-gray-600">
                Service traiteur spécialisé en cuisine congolaise
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <House className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Services Ménagers</h3>
              <p className="text-gray-600">
                Entretien et nettoyage professionnel
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Bike className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Location de Vélos</h3>
              <p className="text-gray-600">
                Découvrez la ville autrement
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Courses à Domicile</h3>
              <p className="text-gray-600">
                Livraison de vos courses quotidiennes
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* New Services Section 1 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Services Spécialisés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Building className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Location Immobilière</h3>
              <p className="text-gray-600">
                Trouvez votre logement idéal
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Doctor className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Assistance Médicale</h3>
              <p className="text-gray-600">
                Consultation et soins à domicile
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Soutien Scolaire</h3>
              <p className="text-gray-600">
                Cours particuliers et aide aux devoirs
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* New Services Section 2 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Services Professionnels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Services Juridiques</h3>
              <p className="text-gray-600">
                Conseil et assistance juridique
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Heart className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Aide aux Personnes</h3>
              <p className="text-gray-600">
                Services d'assistance personnalisée
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Book className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Formation Continue</h3>
              <p className="text-gray-600">
                Développement professionnel
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Package className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Déménagement</h3>
              <p className="text-gray-600">
                Service complet de déménagement
              </p>
            </Card>
          </div>
        </div>
      </section>

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
