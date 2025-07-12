
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, UtensilsCrossed, Package, Car, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Restaurants",
      description: "Découvrez une sélection de restaurants à Brazzaville",
      icon: UtensilsCrossed,
      action: () => navigate("/restaurants"),
      color: "bg-gradient-to-br from-orange-400 to-red-500"
    },
    {
      title: "Livraison",
      description: "Suivez votre livraison en temps réel",
      icon: Package,
      action: () => navigate("/delivery"),
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      title: "Taxi",
      description: "Réservez un taxi rapidement et en toute sécurité",
      icon: Car,
      action: () => navigate("/taxis"),
      color: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      title: "Covoiturage",
      description: "Partagez vos trajets et économisez",
      icon: Users,
      action: () => navigate("/covoiturage"),
      color: "bg-gradient-to-br from-teal-400 to-teal-600"
    },
    {
      title: "Livraison de colis",
      description: "Envoyez et recevez vos colis rapidement et en toute sécurité",
      icon: Package,
      action: () => navigate("/services/colis"),
      color: "bg-gradient-to-br from-yellow-400 to-orange-500"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Nos Services</h2>
          <p className="text-gray-300 text-center max-w-3xl mx-auto mb-16">Découvrez notre gamme complète de services conçus pour vous offrir confort et commodité au quotidien.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              custom={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', bounce: 0.3 }}
              whileHover={{ scale: 1.06, boxShadow: '0 8px 32px 0 rgba(255, 165, 0, 0.25)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className={
                  `bg-black/40 backdrop-blur-md border border-white/10 transition-all h-full text-white cursor-pointer rounded-xl overflow-hidden relative ` +
                  (service.title === "Livraison de colis" ? " ring-4 ring-yellow-400/60 animate-glow " : "")
                }
                onClick={service.action}
              >
                <div className={`${service.color} rounded-t-lg py-6 px-4 flex justify-center items-center`}>
                  <service.icon 
                    className={
                      `w-12 h-12 text-white ` +
                      (service.title === "Livraison de colis" ? " animate-pulse-smooth " : "")
                    }
                  />
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-300 text-sm mb-6">{service.description}</p>
                  <Button 
                    onClick={service.action}
                    className="w-full group bg-white/10 hover:bg-white/20 text-white"
                    variant="ghost"
                  >
                    Découvrir
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
