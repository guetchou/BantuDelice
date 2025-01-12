import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Star, ShoppingCart, Shield, Trophy, Heart, MessageSquare, Users, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DeliveryMap from "@/components/DeliveryMap";

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
    <div className="container mx-auto px-4">
      {/* Hero Section with Carousel */}
      <section className="py-20 text-center mb-16">
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            <CarouselItem>
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg p-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Solutions Innovantes pour Votre Entreprise
                </h1>
                <p className="text-xl mb-8">
                  Call Center, E-commerce, et Solutions Téléphoniques
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/contact')}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Contactez-nous
                </Button>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg p-12">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  Excellence et Innovation
                </h2>
                <p className="text-xl mb-8">
                  Des solutions sur mesure pour votre croissance
                </p>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Découvrir nos Services
                </Button>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Nos Atouts Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos Atouts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Fiabilité</h3>
            <p className="text-gray-600">
              Service continu et performance garantie
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Expertise</h3>
            <p className="text-gray-600">
              Plus de 10 ans d'expérience
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Satisfaction Client</h3>
            <p className="text-gray-600">
              98% de clients satisfaits
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Support 24/7</h3>
            <p className="text-gray-600">
              Assistance technique permanente
            </p>
          </Card>
        </div>
      </section>

      {/* À Propos Section */}
      <section className="py-16 bg-gray-50 rounded-lg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">À Propos de Nous</h2>
          <p className="text-lg mb-8">
            Depuis notre création, nous nous engageons à fournir des solutions innovantes
            et performantes pour répondre aux besoins de nos clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Notre Équipe</h3>
              <p>Experts passionnés et dévoués</p>
            </div>
            <div className="text-center">
              <Building className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Notre Mission</h3>
              <p>Innover pour votre succès</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Nos Valeurs</h3>
              <p>Excellence, Intégrité, Innovation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="mb-4">
              <Phone className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Center</h3>
            <p className="text-gray-600 mb-4">
              Solutions professionnelles pour la gestion de vos appels
            </p>
            <Button variant="outline" className="w-full">En savoir plus</Button>
          </Card>
          
          <Card className="p-6">
            <div className="mb-4">
              <ShoppingCart className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">E-commerce</h3>
            <p className="text-gray-600 mb-4">
              Plateforme de vente en ligne personnalisée
            </p>
            <Button variant="outline" className="w-full">Découvrir</Button>
          </Card>
          
          <Card className="p-6">
            <div className="mb-4">
              <Phone className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Téléphonie d'Entreprise</h3>
            <p className="text-gray-600 mb-4">
              Solutions téléphoniques adaptées à vos besoins
            </p>
            <Button variant="outline" className="w-full">Plus d'infos</Button>
          </Card>
        </div>
      </section>

      {/* Contact Section with Map */}
      <section className="py-16 bg-gray-50 rounded-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contactez-nous</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <form className="space-y-6">
                <div>
                  <Input placeholder="Votre nom" />
                </div>
                <div>
                  <Input type="email" placeholder="Votre email" />
                </div>
                <div>
                  <textarea 
                    className="w-full p-3 border rounded-md" 
                    rows={4} 
                    placeholder="Votre message"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">Envoyer</Button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-primary" />
                <span>123 Rue du Commerce, 75001 Paris</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <span>contact@entreprise.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <DeliveryMap 
                latitude={48.8566}
                longitude={2.3522}
                zoom={14}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-purple-600 text-white rounded-lg mb-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Restez Informé</h2>
          <p className="mb-8">
            Inscrivez-vous à notre newsletter pour recevoir nos actualités
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