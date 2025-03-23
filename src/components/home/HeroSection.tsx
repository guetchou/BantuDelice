
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  foodImages: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ foodImages }) => {
  const navigate = useNavigate();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % foodImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [foodImages.length]);

  const heroContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const heroItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {foodImages.map((image, index) => (
        <motion.div
          key={image}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentBgIndex === index ? 1 : 0,
            scale: currentBgIndex === index ? 1.05 : 1 
          }}
          transition={{ duration: 1.5 }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80">
        <div className="container mx-auto px-6 flex items-center h-full">
          <motion.div 
            className="max-w-4xl"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={heroItem} 
              className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight"
            >
              Découvrez la Cuisine<br />
              <span className="text-orange-500">Congolaise</span> Authentique
            </motion.h1>
            
            <motion.p 
              variants={heroItem}
              className="text-xl text-white/90 mb-12 max-w-2xl"
            >
              Des plats traditionnels préparés avec passion et livrés directement chez vous.
              Explorez une expérience culinaire unique.
            </motion.p>
            
            <motion.div variants={heroItem} className="flex flex-wrap gap-6">
              <Button 
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-lg group"
                onClick={() => navigate('/restaurants')}
              >
                Commander Maintenant
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10 font-semibold px-8 py-6 text-lg flex items-center gap-2"
                onClick={() => navigate('/taxi/booking')}
              >
                <Car className="w-5 h-5" />
                Réserver un Taxi
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/80 rounded-full mt-2"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
