
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';

export const OfflineDetector = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 inset-x-0 z-50 bg-orange-500 text-white p-2 flex items-center justify-center shadow-md"
        >
          <WifiOff className="w-4 h-4 mr-2" />
          <span>Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent ne pas être disponibles.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
