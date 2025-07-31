
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface PromoItem {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  buttonText: string;
  buttonLink: string;
  image?: string;
}

interface PromoCarouselProps {
  items: PromoItem[];
  autoPlay?: boolean;
  interval?: number;
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({ 
  items, 
  autoPlay = true,
  interval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);
  
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  
  return (
    <div className="relative w-full rounded-xl overflow-hidden h-60 md:h-72 my-10">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 ${items[currentIndex].bgColor} flex items-center`}
        >
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${items[currentIndex].textColor}`}>
                {items[currentIndex].title}
              </h3>
              <p className={`text-sm md:text-base mb-4 ${items[currentIndex].textColor}`}>
                {items[currentIndex].description}
              </p>
              <Button 
                variant="default" 
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => window.location.href = items[currentIndex].buttonLink}
              >
                {items[currentIndex].buttonText}
              </Button>
            </div>
            
            {items[currentIndex].image && (
              <div className="md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0">
                <img 
                  src={items[currentIndex].image} 
                  alt={items[currentIndex].title}
                  className="h-32 md:h-48 object-contain" 
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      
      <button 
        onClick={goToPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white backdrop-blur-sm"
        aria-label="Previous promo"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white backdrop-blur-sm"
        aria-label="Next promo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
        {items.map((_, idx) => (
          <button 
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to promo ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;
