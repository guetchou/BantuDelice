
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Package, Truck, Home, RefreshCw } from 'lucide-react';
import { cn } from "@/lib/utils";

interface OrderTrackingSectionProps {
  orderId: string | null;
  onReset?: () => void;
}

interface DeliveryStatus {
  icon: React.ReactNode;
  title: string;
  description: string;
  time?: string;
  status: 'completed' | 'current' | 'upcoming';
}

const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  orderId,
  onReset
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    driver: "Mamadou Diop",
    estimatedTime: "20-30 min",
    status: "en préparation"
  });
  
  // Simuler la progression de la commande
  useEffect(() => {
    const simulationInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 4) {
          // Mettre à jour le statut de livraison
          if (prev === 0) setDeliveryInfo(prev => ({...prev, status: "en préparation"}));
          if (prev === 1) setDeliveryInfo(prev => ({...prev, status: "prêt à être livré"}));
          if (prev === 2) setDeliveryInfo(prev => ({...prev, status: "en livraison"}));
          if (prev === 3) setDeliveryInfo(prev => ({...prev, status: "livré"}));
          
          return prev + 1;
        }
        clearInterval(simulationInterval);
        return prev;
      });
    }, 5000);
    
    return () => clearInterval(simulationInterval);
  }, []);
  
  const deliverySteps: DeliveryStatus[] = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Commande confirmée",
      description: "Votre commande a été reçue et confirmée",
      time: new Date(Date.now() - 15 * 60000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: currentStep >= 0 ? 'completed' : 'upcoming'
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Préparation",
      description: `Votre commande est ${deliveryInfo.status}`,
      time: currentStep >= 1 ? new Date(Date.now() - 10 * 60000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming'
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "En route",
      description: `${deliveryInfo.driver} est en route pour la livraison`,
      time: currentStep >= 2 ? new Date(Date.now() - 5 * 60000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming'
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: "Livré",
      description: "Votre commande a été livrée",
      time: currentStep >= 3 ? new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming'
    }
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Suivi de commande {orderId && `#${orderId.slice(0, 8)}`}</span>
          {onReset && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Nouvelle commande
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-8">
          {deliverySteps.map((step, index) => (
            <div key={index} className="relative flex">
              {/* Ligne de connexion verticale */}
              {index < deliverySteps.length - 1 && (
                <div className="absolute top-10 left-3.5 bottom-0 w-0.5 bg-muted-foreground/20" />
              )}
              
              {/* Indicateur d'étape (cercle avec icône) */}
              <div className={cn(
                "relative z-10 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full mr-4",
                step.status === 'completed' ? "bg-green-500 text-white" : 
                step.status === 'current' ? "bg-primary text-white" : 
                "bg-muted-foreground/20 text-muted-foreground"
              )}>
                {step.status === 'completed' ? <Check className="h-4 w-4" /> : step.icon}
              </div>
              
              {/* Contenu de l'étape */}
              <div className="flex-1 pb-8">
                <div className="flex justify-between">
                  <h3 className={cn(
                    "font-medium",
                    step.status === 'completed' ? "text-green-500" : 
                    step.status === 'current' ? "text-primary" : 
                    "text-muted-foreground"
                  )}>
                    {step.title}
                  </h3>
                  {step.time && (
                    <span className="text-sm text-muted-foreground">
                      {step.time}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {step.description}
                </p>
                
                {/* Informations supplémentaires pour l'étape en cours */}
                {step.status === 'current' && index === 1 && (
                  <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                    <p>Temps estimé: <span className="font-medium">{deliveryInfo.estimatedTime}</span></p>
                  </div>
                )}
                
                {step.status === 'current' && index === 2 && (
                  <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                    <p>Livreur: <span className="font-medium">{deliveryInfo.driver}</span></p>
                    <p className="mt-1">Temps estimé: <span className="font-medium">{deliveryInfo.estimatedTime}</span></p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {currentStep >= 4 && (
            <div className="flex justify-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center w-full">
                <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium text-green-700">Commande complétée</h3>
                <p className="text-sm text-green-600 mt-1">
                  Merci pour votre commande !
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrackingSection;
