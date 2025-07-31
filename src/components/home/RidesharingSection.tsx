
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Flower2, DollarSign, Clock, ChevronRight } from 'lucide-react';

const RidesharingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L2c+PC9zdmc+')] bg-repeat opacity-5"></div>
      
      <motion.div
        className="absolute bottom-40 left-20 w-64 h-64 bg-green-500/10 rounded-full blur-[120px]"
        animate={{ 
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Partagez vos trajets quotidiens</h2>
            <p className="text-gray-300 text-lg mb-8">
              Économisez de l'argent, réduisez votre empreinte carbone et faites de nouvelles connaissances 
              avec notre service de covoiturage urbain à Brazzaville.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mr-4 shrink-0">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Économies importantes</h3>
                  <p className="text-gray-400 text-sm">Réduisez jusqu'à 70% de vos frais de transport</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mr-4 shrink-0">
                  <Flower2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Écologique</h3>
                  <p className="text-gray-400 text-sm">Contribuez à la réduction des émissions de CO2</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mr-4 shrink-0">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Communauté</h3>
                  <p className="text-gray-400 text-sm">Rencontrez des personnes partageant vos trajets</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mr-4 shrink-0">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Trajets récurrents</h3>
                  <p className="text-gray-400 text-sm">Planifiez vos déplacements réguliers à l'avance</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/covoiturage')}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center group"
              size="lg"
            >
              Trouver un covoiturage
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl blur opacity-50"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <img 
                  src="public/images/taxi-brazzaville.png" 
                  alt="Covoiturage" 
                  className="w-full h-auto rounded-t-lg object-cover"
                  style={{ height: "280px" }}
                />
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Populaire
                    </div>
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      Économique
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">Trajets quotidiens partagés</h3>
                  <p className="text-gray-300 mb-4">
                    Plus de 2,000 personnes utilisent déjà notre service de covoiturage quotidien à Brazzaville.
                  </p>
                  
                  <div className="border-t border-gray-800 pt-4">
                    <Button 
                      variant="outline" 
                      className="text-green-400 border-green-500/20 hover:bg-green-500/10 w-full"
                      onClick={() => navigate('/covoiturage')}
                    >
                      Voir les trajets disponibles
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

export default RidesharingSection;
