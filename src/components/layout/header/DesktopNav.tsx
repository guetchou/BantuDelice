
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface DesktopNavProps {
  isAdmin: boolean;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isAdmin }) => {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Accueil', path: '/home' },
    { label: 'Restaurants', path: '/restaurants' },
    { label: 'Commandes', path: '/orders' },
    { label: 'Wallet', path: '/wallet' },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
      {menuItems.map((item, index) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Button
            variant={location.pathname === item.path ? "default" : "ghost"}
            asChild
            className={location.pathname === item.path 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "text-white hover:bg-white/10 hover:text-primary transition-colors"}
          >
            <Link to={item.path}>{item.label}</Link>
          </Button>
        </motion.div>
      ))}
      
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Button
            variant={location.pathname === '/admin' ? "default" : "ghost"}
            asChild
            className={location.pathname === '/admin' ? "bg-primary text-white" : "text-white hover:bg-white/10"}
          >
            <Link to="/admin">Admin</Link>
          </Button>
        </motion.div>
      )}
    </nav>
  );
};

export default DesktopNav;
