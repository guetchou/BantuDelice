
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, ChevronRight, Star, Clock, Heart, Eye } from 'lucide-react';

const TrendingSection = () => {
  const navigate = useNavigate();

  const trendingItems = [
    {
      id: 'trend1',
      title: 'Festival Culinaire Congolais',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1934&auto=format&fit=crop',
      description: 'Une célébration des saveurs traditionnelles congolaises au cœur de Brazzaville',
      date: '28-30 Juin',
      category: 'Événement',
      views: 4529
    },
    {
      id: 'trend2',
      title: 'Nouveau restaurant: La Savane',
      image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2940&auto=format&fit=crop',
      description: 'Découvrez une fusion afro-européenne dans ce nouveau lieu tendance',
      rating: 4.8,
      category: 'Restaurant',
      views: 3218
    },
    {
      id: 'trend3',
      title: 'Programme de fidélité taxi',
      image: 'public/images/taxi-bzv.jpg',
      description: 'Bénéficiez de courses gratuites et de réductions exclusives',
      category: 'Service',
      views: 2976
    },
    {
      id: 'trend4',
      title: 'Plat du mois: Poulet Moambe',
      image: 'public/images/poulet-moambe.jpg',
      description: 'Le plat traditionnel revisité par nos meilleurs restaurants partenaires',
      rating: 4.9,
      category: 'Cuisine',
      views: 5124
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L2c+PC9zdmc+')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">
              <Flame className="h-3.5 w-3.5 mr-1" />
              À la une
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Tendances du moment</h2>
            <p className="text-gray-300 max-w-2xl">
              Découvrez ce qui fait vibrer Brazzaville en ce moment, des évènements aux nouveaux restaurants et services à ne pas manquer
            </p>
          </div>
          
          <Button 
            variant="link" 
            className="text-red-400 hover:text-red-300 flex items-center mt-4 md:mt-0"
            onClick={() => navigate('/explorer')}
          >
            Voir tout
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-red-500/50 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/explorer/${item.id}`)}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <Badge className="bg-black/60 text-white border-none">
                    {item.category}
                  </Badge>
                  
                  <div className="flex items-center space-x-1 text-white">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="text-xs">{item.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex justify-between items-center">
                  {item.rating ? (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-white">{item.rating}</span>
                    </div>
                  ) : item.date ? (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-400 mr-1" />
                      <span className="text-white">{item.date}</span>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full p-2 h-auto hover:bg-red-500/20 text-red-400 hover:text-red-300"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-2">Restez informé des dernières tendances</h3>
            <p className="text-gray-300">Recevez nos alertes tendances directement sur votre téléphone</p>
          </div>
          
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => navigate('/notifications/subscription')}
          >
            Activer les notifications
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;
