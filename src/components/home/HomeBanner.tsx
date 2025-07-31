
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface HomeBannerProps {
  title: string;
  subtitle: string;
  primaryActionText: string;
  primaryActionRoute: string;
  backgroundImage: string;
  showSearch?: boolean;
}

const HomeBanner: React.FC<HomeBannerProps> = ({
  title,
  subtitle,
  primaryActionText,
  primaryActionRoute,
  backgroundImage,
  showSearch = false
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="relative w-full h-[50vh] mb-12">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent"></div>
      </div>
      
      <div className="relative h-full w-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl text-gray-200 max-w-3xl mx-auto mb-8"
        >
          {subtitle}
        </motion.p>

        {showSearch ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-xl"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un restaurant, un plat, une adresse..."
                className="w-full h-14 pl-5 pr-12 rounded-full bg-white/90 backdrop-blur-md text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary rounded-full text-white">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => navigate(primaryActionRoute)}
            >
              {primaryActionText}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomeBanner;
