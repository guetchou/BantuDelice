
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Package, Clock, ArrowRight, CheckCircle2, Truck } from 'lucide-react';

export interface OrderTrackingSectionProps {
  orderId: string;
  onReset: () => void;
}

const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({ 
  orderId,
  onReset
}) => {
  const steps = [
    { icon: <CheckCircle2 className="h-6 w-6" />, label: 'Commande confirmée', completed: true },
    { icon: <Package className="h-6 w-6" />, label: 'Préparation en cours', completed: true },
    { icon: <Truck className="h-6 w-6" />, label: 'En livraison', completed: true },
    { icon: <MapPin className="h-6 w-6" />, label: 'Livré', completed: false }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Suivi de commande</span>
          <span className="text-sm font-normal text-muted-foreground">
            #{orderId}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Tracker */}
        <div className="relative">
          {/* The progress line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200">
            <div className="h-full bg-orange-500 w-3/4"></div>
          </div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full 
                  ${step.completed ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {step.icon}
                </div>
                <span className="text-xs text-center max-w-[80px]">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Delivery Info */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center space-x-3">
            <Truck className="h-5 w-5 text-orange-500" />
            <div>
              <h3 className="text-sm font-medium">Votre commande est en route</h3>
              <p className="text-xs text-gray-500">Estimation d'arrivée: 15 minutes</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-orange-500" />
              <div className="text-sm">123 Rue de la République, Paris, 75001</div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div className="text-sm">Durée estimée: 15 minutes</div>
            </div>
          </div>
        </div>
        
        {/* Driver Info */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver" className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="font-medium">Jean Dupont</h3>
              <p className="text-sm text-gray-500">Livreur</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              Contacter
            </Button>
          </div>
        </div>
        
        <Button 
          onClick={onReset} 
          variant="ghost" 
          className="w-full text-orange-500 hover:text-orange-600 hover:bg-orange-50"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Nouvelle commande
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderTrackingSection;
