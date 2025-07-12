
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-10 md:p-16"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-400/30 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-red-400/30 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Téléchargez notre application mobile
                </h2>
                <p className="text-white/80 text-lg mb-6">
                  Accédez à toutes nos fonctionnalités où que vous soyez et profitez d'offres exclusives réservées aux utilisateurs mobiles.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-white/90"
                  >
                    <svg viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4 mr-2">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                    App Store
                  </Button>
                  <Button 
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-white/90"
                  >
                    <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4 mr-2">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                    </svg>
                    Google Play
                  </Button>
                </div>
              </div>
              
              <div className="relative h-96 w-64 md:h-80 shrink-0 mx-auto md:mx-0">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="absolute w-52 h-auto top-0 -right-4 z-20 rounded-xl shadow-2xl"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1622227056993-6e7f88420e4f?q=80&w=1887&auto=format&fit=crop" 
                    alt="App mobile 1" 
                    className="w-full h-auto rounded-xl"
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 20, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="absolute w-52 h-auto left-0 top-20 z-10 rounded-xl shadow-2xl"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1770&auto=format&fit=crop" 
                    alt="App mobile 2" 
                    className="w-full h-auto rounded-xl"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
