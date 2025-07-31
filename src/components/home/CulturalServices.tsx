import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const culturalEvents = [
  {
    title: "Festival Gastronomique",
    date: "25-27 Mars 2024",
    description: "Découvrez la richesse de la cuisine congolaise",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    route: "/events/gastronomy"
  },
  {
    title: "Cours de Cuisine Traditionnelle",
    date: "Chaque weekend",
    description: "Apprenez à préparer les plats traditionnels",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    route: "/events/cooking-class"
  },
  {
    title: "Soirées Culturelles",
    date: "Tous les vendredis",
    description: "Musique, danse et gastronomie congolaise",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    route: "/events/cultural-nights"
  }
];

const CulturalServices = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Événements Culturels
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {culturalEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-indigo-300 mb-2">{event.date}</p>
                  <p className="text-gray-300 mb-6">
                    {event.description}
                  </p>
                  <Button 
                    onClick={() => navigate(event.route)}
                    className="w-full bg-indigo-500 hover:bg-indigo-600"
                  >
                    En savoir plus
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CulturalServices;