
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Clock, Shield, CreditCard, ChevronRight, Calendar, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TaxiSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Clock className="h-6 w-6 text-yellow-400" />,
      title: "Rapide & Fiable",
      description: "Des chauffeurs disponibles 24/7 pour vous emmener où vous voulez en quelques minutes"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-400" />,
      title: "Sûr & Sécurisé",
      description: "Tous nos chauffeurs sont vérifiés et les courses sont suivies en temps réel"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-blue-400" />,
      title: "Prix Transparent",
      description: "Connaissez le prix exact avant de valider votre course, sans surcharges cachées"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 opacity-5" width="100%" height="100%">
          <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 mb-4">Service Taxi</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Déplacez-vous facilement <br />
              <span className="text-yellow-400">à travers Brazzaville</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Notre service de taxi vous offre une expérience de transport sans stress, avec des chauffeurs 
              professionnels et des véhicules confortables à votre disposition en quelques clics.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-6 rounded-lg text-lg group flex items-center"
                onClick={() => navigate('/taxi/booking')}
              >
                Commander un Taxi
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 font-medium px-6 py-6 rounded-lg text-lg"
                onClick={() => navigate('/taxi')}
              >
                En savoir plus
              </Button>
            </div>
            
            <div className="flex items-center gap-8 mt-10">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-yellow-400">5min</div>
                <div className="text-gray-400 text-sm">Temps d'attente</div>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-yellow-400">24/7</div>
                <div className="text-gray-400 text-sm">Disponibilité</div>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-yellow-400">4.9<span className="text-xl">/5</span></div>
                <div className="text-gray-400 text-sm">Satisfaction</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 lg:pl-12"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-20 transform -translate-y-1/2"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                <div className="p-8 relative">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full"></div>
                  
                  <div className="bg-gray-900/70 rounded-lg p-4 mb-6 flex items-center gap-4">
                    <Car className="h-10 w-10 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-medium">Réservez maintenant</h3>
                      <p className="text-gray-400 text-sm">Ou planifiez pour plus tard</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded-lg p-4 flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
                        <MapPin className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Départ</div>
                        <div className="text-white">Votre position actuelle</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 flex items-center">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                        <MapPin className="h-5 w-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Destination</div>
                        <div className="text-white">Centre-ville de Brazzaville</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-500">Date</span>
                      </div>
                      <div className="text-white">Aujourd'hui</div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-500">Heure</span>
                      </div>
                      <div className="text-white">Maintenant</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3">
                    <Button 
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                      onClick={() => navigate('/taxi/booking')}
                    >
                      Commander
                      <Car className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                      onClick={() => navigate('/taxi/booking?scheduled=true')}
                    >
                      Programmer
                      <Calendar className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-900/80 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-gray-300 text-sm">Tarif estimé: 2500 - 3000 XAF</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                    -15% aujourd'hui
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-3">{feature.icon}</div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default TaxiSection;
