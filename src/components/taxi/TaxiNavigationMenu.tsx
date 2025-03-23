
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, MapPinned, Calendar, Building2, History, ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

interface TaxiNavigationMenuProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const TaxiNavigationMenu: React.FC<TaxiNavigationMenuProps> = ({ 
  showBackButton = false,
  onBack = () => {}
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navigationItems = [
    { 
      icon: <Car className="h-5 w-5" />, 
      label: "Réserver", 
      path: "/taxi/booking",
      description: "Commander un taxi"
    },
    { 
      icon: <History className="h-5 w-5" />, 
      label: "Mes courses", 
      path: "/taxi/history",
      description: "Historique et trajets à venir"
    },
    { 
      icon: <MapPinned className="h-5 w-5" />, 
      label: "Mes adresses", 
      path: "/taxi/locations",
      description: "Adresses enregistrées"
    },
    { 
      icon: <Calendar className="h-5 w-5" />, 
      label: "Abonnements", 
      path: "/taxi/subscription",
      description: "Forfaits et économies"
    },
    { 
      icon: <Building2 className="h-5 w-5" />, 
      label: "Entreprises", 
      path: "/taxi/business",
      description: "Solutions professionnelles"
    },
  ];

  return (
    <div className="mb-8">
      {showBackButton && (
        <Button
          variant="ghost"
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      )}
      
      <Card className="bg-white shadow-md border-gray-100">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-gray-100">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center text-center p-4 transition-all duration-200 hover:bg-gray-50",
                    isActive(item.path) && "bg-orange-50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full mb-2",
                    isActive(item.path) 
                      ? "bg-orange-100 text-orange-600" 
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {item.icon}
                  </div>
                  <span className={cn(
                    "font-medium text-sm mb-1",
                    isActive(item.path) ? "text-orange-600" : "text-gray-700"
                  )}>
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-500 hidden md:block">
                    {item.description}
                  </span>
                  {isActive(item.path) && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxiNavigationMenu;
