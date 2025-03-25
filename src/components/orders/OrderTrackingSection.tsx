
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatus } from '@/types/order';
import { CheckCircle2, Clock, Package, Truck, X } from 'lucide-react';

interface OrderTrackingSectionProps {
  orderId: string;
  status: OrderStatus;
  estimatedDeliveryTime?: string;
  driver?: {
    name: string;
    phone?: string;
    photo?: string;
  };
  deliveryAddress?: string;
}

const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  orderId,
  status,
  estimatedDeliveryTime,
  driver,
  deliveryAddress,
}) => {
  // Determiner l'étape actuelle en fonction du statut
  const getStepStatus = (step: string) => {
    const statusMap: Record<OrderStatus, string[]> = {
      pending: ['confirmed'],
      accepted: ['confirmed'],
      preparing: ['confirmed', 'preparing'],
      prepared: ['confirmed', 'preparing', 'prepared'],
      delivering: ['confirmed', 'preparing', 'prepared', 'delivering'],
      delivered: ['confirmed', 'preparing', 'prepared', 'delivering', 'delivered'],
      cancelled: [],
      completed: ['confirmed', 'preparing', 'prepared', 'delivering', 'delivered'],
    };

    const completedSteps = statusMap[status] || [];
    if (completedSteps.includes(step)) {
      return 'completed';
    } else if (
      completedSteps.length > 0 &&
      completedSteps[completedSteps.length - 1] === step
    ) {
      return 'current';
    }
    return 'pending';
  };

  // Définition des étapes du processus de livraison
  const steps = [
    {
      id: 'confirmed',
      label: 'Commande confirmée',
      icon: CheckCircle2,
      status: getStepStatus('confirmed'),
    },
    {
      id: 'preparing',
      label: 'En préparation',
      icon: Package,
      status: getStepStatus('preparing'),
    },
    {
      id: 'prepared',
      label: 'Prête à être livrée',
      icon: Package,
      status: getStepStatus('prepared'),
    },
    {
      id: 'delivering',
      label: 'En livraison',
      icon: Truck,
      status: getStepStatus('delivering'),
    },
    {
      id: 'delivered',
      label: 'Livrée',
      icon: CheckCircle2,
      status: getStepStatus('delivered'),
    },
  ];

  // Si la commande est annulée, on affiche un état spécial
  if (status === 'cancelled') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <X className="h-5 w-5" />
            Commande annulée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Votre commande #{orderId.slice(0, 8)} a été annulée.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Suivi de commande</span>
          <span className="text-sm font-normal text-muted-foreground">
            #{orderId.slice(0, 8)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barre de progression */}
        <div className="relative">
          {/* Ligne de progression */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ 
                width: `${
                  status === 'cancelled'
                    ? '0%'
                    : status === 'pending'
                    ? '10%'
                    : status === 'accepted'
                    ? '20%'
                    : status === 'preparing'
                    ? '40%'
                    : status === 'prepared'
                    ? '60%'
                    : status === 'delivering'
                    ? '80%'
                    : '100%'
                }`
              }}
            />
          </div>
          
          {/* Étapes */}
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full 
                  ${step.status === 'completed' 
                    ? 'bg-primary text-primary-foreground' 
                    : step.status === 'current'
                    ? 'bg-primary text-primary-foreground animate-pulse' 
                    : 'bg-muted text-muted-foreground'}`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-center max-w-[80px]">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Informations sur la livraison */}
        {status !== 'pending' && (
          <div className="bg-muted p-4 rounded-lg space-y-3">
            {estimatedDeliveryTime && (
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium">Livraison estimée</h3>
                  <p className="text-xs text-muted-foreground">{estimatedDeliveryTime}</p>
                </div>
              </div>
            )}
            
            {deliveryAddress && (
              <>
                <Separator className="my-2" />
                <div className="text-sm">
                  <span className="font-medium">Adresse de livraison: </span>
                  {deliveryAddress}
                </div>
              </>
            )}
            
            {/* Information du livreur pour les commandes en cours de livraison */}
            {driver && status === 'delivering' && (
              <>
                <Separator className="my-2" />
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-muted rounded-full mr-3 overflow-hidden">
                    {driver.photo ? (
                      <img src={driver.photo} alt={driver.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                        {driver.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{driver.name}</h3>
                    <p className="text-sm text-muted-foreground">Livreur</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTrackingSection;
