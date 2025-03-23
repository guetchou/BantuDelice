
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, MapPin, CreditCard, Building2 } from 'lucide-react';

type TaxiNavigationMenuProps = {
  activeRoute?: 'history' | 'locations' | 'subscription' | 'business'; 
};

const TaxiNavigationMenu: React.FC<TaxiNavigationMenuProps> = ({ activeRoute }) => {
  const location = useLocation();
  
  // Si activeRoute n'est pas fourni, on tente de le déterminer à partir de l'URL
  const currentRoute = activeRoute || (() => {
    if (location.pathname.includes('/history')) return 'history';
    if (location.pathname.includes('/locations')) return 'locations';
    if (location.pathname.includes('/subscription')) return 'subscription';
    if (location.pathname.includes('/business')) return 'business';
    return undefined;
  })();
  
  const menuItems = [
    {
      id: 'history',
      label: 'Mes courses',
      icon: Clock,
      path: '/taxi/history'
    },
    {
      id: 'locations',
      label: 'Mes adresses',
      icon: MapPin,
      path: '/taxi/locations'
    },
    {
      id: 'subscription',
      label: 'Abonnements',
      icon: CreditCard,
      path: '/taxi/subscription'
    },
    {
      id: 'business',
      label: 'Entreprises',
      icon: Building2,
      path: '/taxi/business'
    }
  ];
  
  return (
    <div className="border-b border-t py-4 bg-background sticky top-0 z-10">
      <div className="flex justify-between max-w-3xl mx-auto overflow-x-auto hide-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          
          return (
            <Button
              key={item.id}
              asChild
              variant={isActive ? "default" : "ghost"}
              className="flex-shrink-0 gap-2"
            >
              <Link to={item.path}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TaxiNavigationMenu;
