import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, Cog, Search } from "lucide-react";

const additionalServices = [
  {
    icon: MessageSquare,
    title: "Support Client 24/7",
    description: "Une équipe dédiée à votre écoute pour répondre à vos besoins",
    action: "Contacter"
  },
  {
    icon: Search,
    title: "Recherche Personnalisée",
    description: "Trouvez exactement ce que vous cherchez avec notre système de recherche avancé",
    action: "Rechercher"
  },
  {
    icon: Cog,
    title: "Personnalisation",
    description: "Adaptez nos services selon vos préférences",
    action: "Personnaliser"
  }
];

const AdditionalServices = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Services Additionnels
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <service.icon className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-300 mb-6">
                  {service.description}
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-white"
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

export default AdditionalServices;