
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          asChild
          className={location.pathname === item.path ? "bg-accent" : ""}
        >
          <Link to={item.path}>{item.label}</Link>
        </Button>
      ))}
      
      {isAdmin && (
        <Button
          variant="ghost"
          asChild
          className={location.pathname === '/admin' ? "bg-accent" : ""}
        >
          <Link to="/admin">Admin</Link>
        </Button>
      )}
    </nav>
  );
};

export default DesktopNav;
