
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Car, Pizza, Map, MessageCircle, Users, Navigation } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

const Home = () => {
  const { findNearMe } = useGeolocation();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/hero-background.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative py-16 px-8 md:py-24 md:px-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tout ce dont vous avez besoin, livré à votre porte
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Commandez de la nourriture, réservez un taxi, trouvez un covoiturage ou faites-vous livrer - le tout dans une seule application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90">
              <Link to="/restaurants" className="flex items-center">
                Commander maintenant <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/taxi/booking">Réserver un taxi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Nos services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard 
            title="Restauration" 
            description="Commandez auprès des meilleurs restaurants locaux"
            icon={<Pizza className="h-8 w-8 text-orange-500" />}
            linkTo="/restaurants"
            color="bg-orange-50"
          />
          <ServiceCard 
            title="Taxi" 
            description="Réservez un taxi pour vous déplacer rapidement"
            icon={<Car className="h-8 w-8 text-blue-500" />}
            linkTo="/taxi/booking"
            color="bg-blue-50"
          />
          <ServiceCard 
            title="Covoiturage" 
            description="Partagez vos trajets et économisez"
            icon={<Users className="h-8 w-8 text-green-500" />}
            linkTo="/covoiturage"
            color="bg-green-50"
          />
          <ServiceCard 
            title="Livraison" 
            description="Faites-vous livrer vos courses et colis"
            icon={<Navigation className="h-8 w-8 text-purple-500" />}
            linkTo="/delivery"
            color="bg-purple-50"
          />
        </div>
      </section>

      {/* Map & Explore Section */}
      <section className="mb-16 bg-gray-50 rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Explorez les restaurants près de chez vous</h2>
            <p className="text-gray-600 mb-6">
              Découvrez une large sélection de restaurants et de plats délicieux dans votre quartier.
            </p>
            <Button onClick={findNearMe} className="bg-orange-500 hover:bg-orange-600">
              <Map className="mr-2 h-4 w-4" /> Trouver près de moi
            </Button>
          </div>
          <div className="w-full md:w-1/2 h-[300px] bg-gray-200 rounded-lg">
            {/* Map placeholder */}
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Carte des restaurants à proximité</span>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="mb-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Téléchargez notre application</h2>
            <p className="max-w-md mb-6">
              Profitez d'une expérience encore meilleure avec notre application mobile. Commandez, réservez et suivez vos livraisons en déplacement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                App Store
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Google Play
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <img 
              src="/mobile-app-mockup.png" 
              alt="Application mobile" 
              className="w-full max-w-[200px] mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Message/Support Section */}
      <section className="mb-16">
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">Besoin d'aide ?</h2>
              <p className="text-gray-600 mb-6">
                Notre équipe de support est disponible 24/7 pour répondre à toutes vos questions. Contactez-nous via chat, email ou téléphone.
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <MessageCircle className="mr-2 h-4 w-4" /> Discuter avec nous
              </Button>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="rounded-full bg-blue-100 p-8">
                <MessageCircle className="h-16 w-16 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper component for service cards
const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  linkTo, 
  color 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  linkTo: string; 
  color: string;
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-0">
        <Link to={linkTo} className="block">
          <div className={`${color} p-6 flex justify-center`}>
            {icon}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
            <div className="mt-4 flex items-center text-orange-500">
              <span className="mr-2">En savoir plus</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Home;
