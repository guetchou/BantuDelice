
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Clock, 
  Leaf, 
  CreditCard, 
  Calendar,
  MapPin,
  ChevronRight,
  ArrowRight,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RidesharingSection = () => {
  const navigate = useNavigate();

  const benefits = [
    { 
      icon: <Leaf className="h-5 w-5 text-green-500" />, 
      label: "Écologique" 
    },
    { 
      icon: <CreditCard className="h-5 w-5 text-blue-500" />, 
      label: "Économique" 
    },
    { 
      icon: <Users className="h-5 w-5 text-purple-500" />, 
      label: "Social" 
    },
    { 
      icon: <Clock className="h-5 w-5 text-orange-500" />, 
      label: "Flexible" 
    }
  ];

  const trips = [
    {
      id: "trip1",
      driver: {
        name: "Jean K.",
        rating: 4.9,
        trips: 154,
        avatar: "https://i.pravatar.cc/150?img=68"
      },
      origin: "Bacongo",
      destination: "Centre-ville",
      date: "Aujourd'hui",
      time: "17:30",
      price: 2000,
      seats: 3
    },
    {
      id: "trip2",
      driver: {
        name: "Sophie M.",
        rating: 4.8,
        trips: 87,
        avatar: "https://i.pravatar.cc/150?img=47"
      },
      origin: "Poto-Poto",
      destination: "Université",
      date: "Demain",
      time: "08:15",
      price: 1500,
      seats: 2
    },
    {
      id: "trip3",
      driver: {
        name: "Michel T.",
        rating: 4.7,
        trips: 215,
        avatar: "https://i.pravatar.cc/150?img=52"
      },
      origin: "Moungali",
      destination: "Aéroport",
      date: "Vendredi",
      time: "10:45",
      price: 3500,
      seats: 4
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L2c+PC9zdmc+')] bg-repeat opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center">
          <motion.div 
            className="lg:w-1/2 mb-12 lg:mb-0 lg:pl-12"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-4">Covoiturage</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Partagez vos trajets, <br />
              <span className="text-green-400">économisez ensemble</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Notre plateforme de covoiturage met en relation les conducteurs et les passagers 
              pour des trajets partagés économiques, écologiques et conviviaux.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center justify-center bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                    {benefit.icon}
                  </div>
                  <span className="text-white text-sm">{benefit.label}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-6 rounded-lg text-lg group flex items-center"
                onClick={() => navigate('/covoiturage')}
              >
                Trouver un trajet
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 font-medium px-6 py-6 rounded-lg text-lg"
                onClick={() => navigate('/covoiturage/proposer')}
              >
                Proposer un trajet
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 lg:pr-12 w-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">Trajets disponibles</h3>
                <p className="text-gray-400">Trouvez un trajet qui correspond à vos besoins</p>
              </div>
              
              <div className="divide-y divide-gray-700">
                {trips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                    viewport={{ once: true }}
                    onClick={() => navigate(`/covoiturage/trip/${trip.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={trip.driver.avatar} 
                          alt={trip.driver.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-white font-medium">{trip.driver.name}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-sm">{trip.driver.rating}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2 flex-shrink-0">
                              <MapPin className="h-3 w-3 text-blue-400" />
                            </div>
                            <span className="text-gray-300 truncate">{trip.origin}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2 flex-shrink-0">
                              <MapPin className="h-3 w-3 text-green-400" />
                            </div>
                            <span className="text-gray-300 truncate">{trip.destination}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-2 flex-shrink-0">
                              <Calendar className="h-3 w-3 text-purple-400" />
                            </div>
                            <span className="text-gray-300">{trip.date}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mr-2 flex-shrink-0">
                              <Clock className="h-3 w-3 text-orange-400" />
                            </div>
                            <span className="text-gray-300">{trip.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          <div>
                            <span className="text-white font-bold">{trip.price.toLocaleString()} XAF</span>
                            <span className="text-gray-400 text-xs ml-1">par personne</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-gray-300 text-sm">{trip.seats} places</span>
                            <ArrowRight className="h-4 w-4 text-green-400 ml-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-800/50 text-center">
                <Button 
                  variant="link" 
                  className="text-green-400 hover:text-green-300"
                  onClick={() => navigate('/covoiturage')}
                >
                  Voir tous les trajets disponibles
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center">
                <Leaf className="h-6 w-6 text-green-400 mr-3" />
                <div>
                  <h4 className="text-white font-medium">Impact environnemental</h4>
                  <p className="text-gray-300 text-sm">Ensemble, nos utilisateurs ont économisé plus de 25 tonnes de CO₂ ce mois-ci</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RidesharingSection;
