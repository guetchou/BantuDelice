
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackToHome from '@/components/BackToHome';
import { 
  Car, 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  Shield, 
  CreditCard,
  MessageCircle,
  Calendar,
  Route
} from 'lucide-react';

const Covoiturage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Tous nos conducteurs sont vérifiés et assurés"
    },
    {
      icon: CreditCard,
      title: "Paiement sécurisé",
      description: "Paiement en ligne ou en espèces, c'est vous qui choisissez"
    },
    {
      icon: MessageCircle,
      title: "Chat intégré",
      description: "Communiquez directement avec votre conducteur"
    },
    {
      icon: Route,
      title: "Trajets optimisés",
      description: "Routes calculées pour minimiser le temps de trajet"
    }
  ];

  const popularRoutes = [
    {
      from: "Brazzaville Centre",
      to: "Aéroport Maya-Maya",
      price: "2000 FCFA",
      duration: "25 min",
      frequency: "Toutes les 30 min"
    },
    {
      from: "Pointe-Noire Centre",
      to: "Port Autonome",
      price: "1500 FCFA",
      duration: "20 min",
      frequency: "Toutes les 15 min"
    },
    {
      from: "Dolisie",
      to: "Brazzaville",
      price: "8000 FCFA",
      duration: "2h 30",
      frequency: "3 fois par jour"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
        {/* Arrière-plan avec image */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <img 
            src="/images/covoiturage.jpg" 
            alt="Covoiturage BantuDelice" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Bouton retour à l'accueil */}
          <div className="absolute top-4 left-4 z-30">
            <BackToHome variant="icon" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <Car className="h-12 w-12 mr-4" />
            <h1 className="text-5xl font-bold">Covoiturage BantuDelice</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Économisez jusqu'à 60% sur vos trajets en partageant votre véhicule 
            ou en rejoignant d'autres voyageurs. Écologique et économique !
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/covoiturage/proposer">
                <Car className="h-4 w-4 mr-2" />
                Proposer un trajet
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/covoiturage/rechercher">
                <Route className="h-4 w-4 mr-2" />
                Rechercher un trajet
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "50K+", label: "Utilisateurs actifs" },
              { icon: Car, value: "15K+", label: "Trajets effectués" },
              { icon: MapPin, value: "25+", label: "Villes desservies" },
              { icon: Star, value: "4.8", label: "Note moyenne" }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-xl backdrop-blur-md bg-white/70 hover:bg-white/90 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir notre covoiturage ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une solution économique, écologique et sociale pour vos déplacements
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trajets populaires */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trajets populaires
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les trajets les plus demandés et réservez en quelques clics
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {popularRoutes.map((route, index) => (
              <Card key={index} className="border-0 shadow-xl backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Populaire
                    </Badge>
                    <div className="text-2xl font-bold text-blue-600">{route.price}</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">De: {route.from}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Vers: {route.to}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Durée: {route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{route.frequency}</span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    <Link to={`/covoiturage/reserver/${index}`}>
                      Réserver ce trajet
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à voyager autrement ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de covoitureurs et contribuez à un avenir plus durable
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60 transition-all duration-300">
              <Link to="/covoiturage/inscription">Commencer maintenant</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <Link to="/contact">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Covoiturage;
