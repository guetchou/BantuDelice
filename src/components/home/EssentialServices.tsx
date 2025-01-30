import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Car, Fuel, HeartHandshake, Coffee, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    icon: ShoppingCart,
    title: "Commande de Repas",
    description: "Vos plats congolais préférés livrés chauds et dans les meilleurs délais",
    route: "/restaurants",
    color: "text-indigo-600"
  },
  {
    icon: Car,
    title: "Transport VIP",
    description: "Service de transport personnalisé avec chauffeurs professionnels",
    route: "/services/transport",
    color: "text-emerald-600"
  },
  {
    icon: Fuel,
    title: "Livraison de Gaz",
    description: "Approvisionnement rapide et sécurisé à votre porte",
    route: "/services/gas",
    color: "text-orange-600"
  },
  {
    icon: Coffee,
    title: "Service Traiteur",
    description: "Organisation d'événements et service traiteur professionnel",
    route: "/services/catering",
    color: "text-purple-600"
  },
  {
    icon: HeartHandshake,
    title: "Services à Domicile",
    description: "Assistance et services personnalisés à votre domicile",
    route: "/services/home",
    color: "text-rose-600"
  },
  {
    icon: Utensils,
    title: "Cours de Cuisine",
    description: "Apprenez l'art de la cuisine congolaise avec nos chefs",
    route: "/services/cooking",
    color: "text-blue-600"
  }
];

const EssentialServices = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nos Services Essentiels
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <service.icon className={`w-12 h-12 mx-auto mb-4 ${service.color}`} />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <Button 
                  onClick={() => navigate(service.route)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                >
                  Découvrir
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