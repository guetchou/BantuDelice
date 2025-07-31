import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UtensilsCrossed, Truck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: UtensilsCrossed,
    title: "Restaurants Partenaires",
    description: "Découvrez une sélection de restaurants de qualité",
    action: "Explorer",
    route: "/restaurants"
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    description: "Livraison à domicile en 30 minutes",
    action: "Commander",
    route: "/delivery"
  },
  {
    icon: Clock,
    title: "Suivi en Temps Réel",
    description: "Suivez votre commande en direct",
    action: "Suivre",
    route: "/tracking"
  }
];

const EssentialServices = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent animate-gradient-x"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Services Essentiels
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center glass-effect hover-scale">
                <service.icon className="w-12 h-12 mx-auto mb-4 text-neon-blue animate-float" />
                <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-300 mb-6">
                  {service.description}
                </p>
                <Button 
                  onClick={() => navigate(service.route)}
                  className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-blue text-white transition-all duration-300"
                >
                  {service.action}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EssentialServices;