import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Heart, Users, Star } from 'lucide-react';

const FloatingGalleryButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickLinks = [
    {
      icon: Heart,
      label: 'Témoignages',
      href: '/gallery#testimonials',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: Users,
      label: 'Équipe',
      href: '/gallery#team',
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: Star,
      label: 'Excellence',
      href: '/gallery#excellence',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 mb-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[200px]">
              <div className="text-sm font-semibold text-gray-700 mb-3 text-center">
                Accès Rapide
              </div>
              <div className="space-y-2">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        className={`flex items-center gap-3 p-2 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105 bg-gradient-to-r ${link.color}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
            : 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="camera"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Camera className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingGalleryButton; 