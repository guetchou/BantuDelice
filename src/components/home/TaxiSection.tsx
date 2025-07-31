
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Car, Shield, Clock, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TaxiSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L2c+PC9zdmc+')] bg-repeat opacity-5"></div>
      
      <motion.div
        className="absolute top-40 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px]"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Service de Taxi Premium</h2>
            <p className="text-gray-300 text-lg mb-8">
              Voyagez en toute sérénité avec notre service de taxi haut de gamme. 
              Confort, sécurité et ponctualité garantis pour tous vos déplacements à Brazzaville.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mr-4 shrink-0">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Service 24/7</h3>
                  <p className="text-gray-400 text-sm">Disponible à tout moment pour vos déplacements</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mr-4 shrink-0">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Sécurité Maximale</h3>
                  <p className="text-gray-400 text-sm">Chauffeurs certifiés et véhicules assurés</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mr-4 shrink-0">
                  <Star className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Confort Premium</h3>
                  <p className="text-gray-400 text-sm">Véhicules haut de gamme et climatisés</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mr-4 shrink-0">
                  <Car className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Réservation Facile</h3>
                  <p className="text-gray-400 text-sm">Commandez en quelques clics sur notre application</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/taxi/booking')}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center group"
              size="lg"
            >
              Réserver maintenant
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-50"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542223616-9de9adb5e3b8?q=80&w=2980&auto=format&fit=crop" 
                  alt="Taxi Service" 
                  className="w-full h-auto rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Tarifs transparents</h3>
                  <p className="text-gray-300 mb-4">
                    Obtenez immédiatement une estimation précise du prix avant de confirmer votre course.
                  </p>
                  
                  <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-white font-semibold">4.9/5</span>
                      <span className="text-gray-400 text-sm ml-2">(1,245 avis)</span>
                    </div>
                    <Button variant="ghost" className="text-blue-400" size="sm" onClick={() => navigate('/taxi')}>
                      Voir les avis
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TaxiSection;
