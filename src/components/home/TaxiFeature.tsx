import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Car, Clock, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TaxiFeature = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: "Service 24/7",
      description: "Disponible à tout moment pour vos déplacements"
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Chauffeurs certifiés et véhicules assurés"
    },
    {
      icon: Star,
      title: "Confort Premium",
      description: "Véhicules haut de gamme et climatisés"
    },
    {
      icon: Car,
      title: "Réservation Facile",
      description: "Commandez en quelques clics"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-gradient-x">
            Service de Taxi Premium
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Voyagez en toute sérénité avec notre service de taxi haut de gamme. 
            Confort, sécurité et ponctualité garantis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6 hover-scale"
            >
              <feature.icon className="w-12 h-12 text-neon-blue mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => navigate('/taxi/booking')}
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-blue text-white px-8 py-6 text-lg rounded-full transition-all duration-300 animate-glow shadow-lg hover:shadow-xl"
          >
            Réserver un Taxi
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TaxiFeature;