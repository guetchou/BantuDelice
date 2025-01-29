import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppNavigation } from "@/utils/navigation";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ChefHat, Truck, Package, Heart, Car, Calendar, Fuel } from "lucide-react";

const Services = () => {
  const { navigateWithToast } = useAppNavigation();
  
  usePageTitle({ 
    title: "Nos Services",
    description: "Découvrez nos services professionnels" 
  });

  const services = [
    {
      icon: <ChefHat className="w-12 h-12 text-primary" />,
      title: "Service Traiteur",
      description: "Service traiteur professionnel pour vos événements",
      path: "/catering"
    },
    {
      icon: <Car className="w-12 h-12 text-primary" />,
      title: "Transport VIP",
      description: "Service de transport personnalisé",
      path: "/transport"
    },
    {
      icon: <Fuel className="w-12 h-12 text-primary" />,
      title: "Livraison de Gaz",
      description: "Livraison rapide et sécurisée à domicile",
      path: "/gas"
    },
    {
      icon: <Calendar className="w-12 h-12 text-primary" />,
      title: "Réservations",
      description: "Réservez une table dans nos restaurants partenaires",
      path: "/reservations"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Nos Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card 
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {service.icon}
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <Button 
                className="w-full"
                onClick={() => navigateWithToast(service.path, `Bienvenue dans ${service.title}`)}
              >
                En savoir plus
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;