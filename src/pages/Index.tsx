
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UtensilsCrossed, Car, Wallet, Package, Users, Map, MessageSquare } from "lucide-react";
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
      title: "Covoiturage",
      description: "Partagez vos trajets et économisez",
      icon: Users,
      action: () => navigate("/covoiturage"),
      color: "bg-gradient-to-br from-teal-400 to-teal-600"
    },
    {
      title: "Commandes",
      description: "Suivez vos commandes en temps réel",
      icon: Package,
      action: () => navigate("/orders"),
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      title: "Wallet",
      description: "Gérez vos paiements et transactions",
      icon: Wallet,
      action: () => navigate("/wallet"),
      color: "bg-gradient-to-br from-purple-400 to-purple-600"
    },
    {
      title: "Messages",
      description: "Communiquez avec les chauffeurs et livreurs",
      icon: MessageSquare,
      action: () => navigate("/messages"),
      color: "bg-gradient-to-br from-pink-400 to-pink-600"
    },
    {
      title: "Explorer",
      description: "Découvrez les lieux populaires à proximité",
      icon: Map,
      action: () => navigate("/explorer"),
      color: "bg-gradient-to-br from-amber-400 to-amber-600"
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
    <div className="relative min-h-screen">
      {/* Fond d'écran avec superposition */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1603417406253-4c65c06974c5?q=80&w=2070&auto=format&fit=crop')", 
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
              EazyCongo
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Votre plateforme tout-en-un pour vos besoins quotidiens au Congo
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button 
                onClick={() => navigate("/restaurants")} 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="lg"
              >
                Commander
              </Button>
              <Button 
                onClick={() => navigate("/taxi")} 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="lg"
              >
                Réserver un Taxi
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="bg-black/40 backdrop-blur-md border-gray-800 hover:bg-black/50 transition-all h-full text-white">
                  <CardHeader className={`${service.color} rounded-t-lg`}>
                    <div className="flex justify-between items-center">
                      <service.icon className="w-10 h-10" />
                      <h3 className="text-xl font-bold">{service.title}</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 pb-4">
                    <p className="text-gray-300 mb-6">{service.description}</p>
                    <Button 
                      onClick={service.action}
                      className="w-full group bg-white/10 hover:bg-white/20 text-white"
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
            className="text-center bg-black/30 backdrop-blur-md p-8 rounded-xl border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">
              Découvrez l'application tout-en-un pour le Congo
            </h2>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              Transport, livraison de repas, paiements et bien plus encore dans une seule application intuitive et facile à utiliser.
            </p>
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
    </div>
  );
}
