
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DeliveryMap from '@/components/DeliveryMap';
import CartDrawer from '@/components/cart/CartDrawer';
import ChatBubble from '@/components/chat/ChatBubble';
import { useState } from 'react';
import { motion } from "framer-motion";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      
      {/* Hero Section Amélioré */}
      <section className="relative h-[600px] overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/30 to-gray-900/80 backdrop-blur-sm" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl font-bold text-white mb-6">
              Découvrez la<br />
              <span className="text-gradient bg-gradient-to-r from-orange-400 to-green-400">
                Cuisine Africaine
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Une expérience culinaire unique avec les meilleurs restaurants africains. 
              Livraison rapide, plats authentiques, saveurs inoubliables.
            </p>
          </motion.div>
          
          <div className="max-w-2xl w-full relative animate-fade-in delay-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un plat, un restaurant..."
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                         text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500
                         transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 cursor-pointer" 
                onClick={handleSearch}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 animate-fade-in delay-200">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              onClick={() => navigate('/restaurants')}
            >
              Commander maintenant
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate('/services')}
            >
              Nos Services
            </Button>
          </div>
        </div>
      </section>

      {/* Section Services Populaires */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Services Populaires</h2>
            <p className="text-gray-400">Découvrez nos services les plus appréciés</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Livraison Express",
                description: "Livraison en 30 minutes maximum",
                icon: "🚀",
                link: "/services#delivery"
              },
              {
                title: "Traiteur",
                description: "Pour vos événements spéciaux",
                icon: "👨‍🍳",
                link: "/services#catering"
              },
              {
                title: "Click & Collect",
                description: "Retirez votre commande au restaurant",
                icon: "🔄",
                link: "/services#pickup"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-700/50 
                          transition-all duration-300 cursor-pointer"
                onClick={() => navigate(service.link)}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Comment ça marche</h2>
            <p className="text-gray-400">Simple, rapide et pratique</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Choisissez",
                description: "Parcourez nos restaurants partenaires"
              },
              {
                step: "2",
                title: "Commandez",
                description: "Sélectionnez vos plats préférés"
              },
              {
                step: "3",
                title: "Suivez",
                description: "Surveillez votre commande en temps réel"
              },
              {
                step: "4",
                title: "Savourez",
                description: "Profitez de votre repas"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center 
                              text-white font-bold text-xl mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">{item.title}</h3>
                <p className="text-gray-400 text-center">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 
                                bg-gradient-to-r from-orange-500 to-transparent transform -translate-x-1/2"/>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Zone de Livraison */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Notre Zone de Livraison</h2>
            <p className="text-gray-400">Découvrez si vous êtes dans notre zone de livraison</p>
          </motion.div>

          <div className="h-[400px] rounded-lg overflow-hidden shadow-xl">
            <DeliveryMap 
              latitude={-4.4419} 
              longitude={15.2663}
            />
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Pourquoi nous choisir</h2>
            <p className="text-gray-400">Des avantages qui font la différence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Rapidité",
                description: "Livraison express en 30 minutes maximum",
                icon: "⚡"
              },
              {
                title: "Qualité",
                description: "Les meilleurs restaurants sélectionnés pour vous",
                icon: "⭐"
              },
              {
                title: "Sécurité",
                description: "Paiement sécurisé et suivi en temps réel",
                icon: "🔒"
              }
            ].map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="text-4xl mb-4">{advantage.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{advantage.title}</h3>
                <p className="text-gray-400">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Drawer & Chat */}
      <div className="fixed bottom-4 right-4 z-50">
        <CartDrawer />
      </div>

      <div className="fixed bottom-4 left-4 z-50">
        <ChatBubble />
      </div>

      <Footer />
    </main>
  );
}
