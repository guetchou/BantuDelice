
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  route: string;
}

interface FeaturedServicesProps {
  services: Service[];
  title: string;
}

const FeaturedServices: React.FC<FeaturedServicesProps> = ({ services, title }) => {
  const navigate = useNavigate();

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="h-full cursor-pointer overflow-hidden border-none shadow-md"
              onClick={() => navigate(service.route)}
            >
              <div 
                className={`p-4 ${service.color} flex items-center justify-center`}
              >
                <service.icon size={40} className="text-white" />
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <Button 
                  variant="ghost" 
                  className="group p-0 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(service.route);
                  }}
                >
                  <span className="text-primary group-hover:mr-2 transition-all">
                    Découvrir
                  </span>
                  <ArrowRight className="inline h-4 w-4 text-primary ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedServices;
