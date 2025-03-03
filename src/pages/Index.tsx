
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UtensilsCrossed, Car, Wallet, Pizza } from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
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
      title: "Taxi",
      description: "Réservez un taxi rapidement et en toute sécurité",
      icon: Car,
      action: () => navigate("/taxi"),
      color: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      title: "Commandes",
      description: "Suivez vos commandes en temps réel",
      icon: Pizza,
      action: () => navigate("/orders"),
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      title: "Wallet",
      description: "Gérez vos paiements et transactions",
      icon: Wallet,
      action: () => navigate("/wallet"),
      color: "bg-gradient-to-br from-purple-400 to-purple-600"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
            EazyCongo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Votre plateforme de services en ligne au Congo, rapide et fiable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-gray-800 hover:bg-white/10 transition-all h-full">
                <CardHeader className={`${service.color} text-white rounded-t-lg`}>
                  <div className="flex justify-between items-center">
                    <service.icon className="w-12 h-12" />
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <Button 
                    onClick={service.action}
                    className="w-full group"
                    variant="outline"
                  >
                    Découvrir
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            Essayez notre démo de commande complète
          </h2>
          <Button 
            onClick={() => navigate("/order-demo")} 
            size="lg"
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
          >
            Tester la démo
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
