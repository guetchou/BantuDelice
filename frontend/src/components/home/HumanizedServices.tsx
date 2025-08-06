import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Car, 
  Coffee, 
  Users, 
  Package, 
  CreditCard,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Phone
} from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<unknown>;
  image: string;
  features: string[];
  cta: string;
  href: string;
  color: string;
  badge?: string;
}

const services: Service[] = [
  {
    id: 0,
    title: "Livraison de Repas",
    description: "Commandez vos plats préférés et faites-vous livrer en 30 minutes",
    icon: Coffee,
    image: "/images/livreuse-repas.png",
    features: ["Livraison rapide", "+100 restaurants", "Paiement mobile"],
    cta: "Commander maintenant",
    href: "/food",
    color: "from-orange-500 to-red-500",
    badge: "Le plus populaire"
  },
  {
    id: 1,
    title: "Taxi Premium",
    description: "Véhicules haut de gamme avec chauffeurs certifiés",
    icon: Car,
    image: "/images/chauffeur-taxi.png",
    features: ["Suivi GPS", "Assurance incluse", "Paiement cashless"],
    cta: "Réserver un taxi",
    href: "/taxi",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Livraison Express",
    description: "Colis livrés en 24h maximum dans toute la ville",
    icon: Package,
    image: "/images/bg-colis2.jpeg",
    features: ["Suivi en direct", "Emballage offert", "Assurance incluse"],
    cta: "Expédier un colis",
    href: "/colis",
    color: "from-green-500 to-emerald-500",
    badge: "Nouveau"
  },
  {
    id: 3,
    title: "Covoiturage",
    description: "Économisez jusqu'à 60% sur vos trajets",
    icon: Users,
    image: "/images/covoiturage.jpg",
    features: ["Trajets vérifiés", "Chat intégré", "Paiement sécurisé"],
    cta: "Trouver un trajet",
    href: "/covoiturage",
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: 4,
    title: "Services Pro",
    description: "Des experts pour tous vos besoins à domicile",
    icon: Truck,
    image: "/images/nos-services.jpg",
    features: ["Devis instantané", "Profils vérifiés", "Satisfaction garantie"],
    cta: "Voir les services",
    href: "/services",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 5,
    title: "Call Center Multicanal",
    description: "Commandez et obtenez de l'aide par téléphone, SMS, WhatsApp",
    icon: Phone,
    image: "/images/call-center.jpg",
    features: ["Support 24/7", "Multilingue", "Paiement sécurisé"],
    cta: "Nous appeler",
    href: "/call-center",
    color: "from-indigo-500 to-purple-500",
    badge: "Nouveau"
  }
];

const HumanizedServices: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/thedrop24BG.jpg')] bg-cover opacity-5 animate-kenburns"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête amélioré */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
            Nos solutions intégrées
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Services Premium
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez des solutions innovantes pour <span className="font-semibold text-gray-800">simplifier votre quotidien</span>
          </p>
        </div>

        {/* Grille de services améliorée */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.id} 
                className="backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-300 border border-gray-200/50 shadow-lg group overflow-hidden hover:shadow-xl hover:-translate-y-2"
              >
                <CardContent className="p-0 h-full flex flex-col">
                  {/* En-tête de carte avec badge */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-70`}></div>
                    
                    {service.badge && (
                      <div className="absolute top-4 left-4 bg-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {service.badge}
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Contenu de carte */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {service.description}
                    </p>

                    {/* Liste de features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`}></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Bouton CTA amélioré */}
                    <Link to={service.href} className="flex items-center justify-center gap-2">
                      <Button 
                        size="lg"
                        className={`mt-auto w-full bg-gradient-to-r ${service.color} hover:shadow-md hover:opacity-90 transition-all group/button`}
                      >
                        {service.cta}
                        <ChevronRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Statistiques avec animations */}
        <div className="mt-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Clock, value: "30 min", label: "Livraison moyenne", color: "from-orange-400 to-pink-500" },
              { icon: MapPin, value: "25+", label: "Villes desservies", color: "from-green-400 to-blue-500" },
              { icon: CreditCard, value: "100%", label: "Satisfaction client", color: "from-purple-400 to-pink-500" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center backdrop-blur-md bg-white/70 rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-shadow duration-300 hover:bg-white/90"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-full mx-auto mb-4 flex items-center justify-center shadow-md`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 animate-countup">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles globaux pour animations */}
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-kenburns {
          animation: kenburns 20s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
};

export default HumanizedServices;