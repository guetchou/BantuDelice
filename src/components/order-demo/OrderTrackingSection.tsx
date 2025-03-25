
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Truck, Package, RefreshCw, MapPin, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDeliveryTracking } from '@/hooks/useDeliveryTracking';

export interface OrderTrackingSectionProps {
  orderId: string | null;
  onReset: () => void;
  deliveryInfo?: {
    driver: string;
    estimatedTime: string;
    status: string;
  };
}

const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  orderId,
  onReset,
  deliveryInfo = {
    driver: "Mamadou Diop",
    estimatedTime: "20-30 min",
    status: "en préparation"
  }
}) => {
  const {
    loading,
    error,
    deliveryStatus,
    estimatedTime,
    driver
  } = useDeliveryTracking(orderId || '');

  // Si un vrai suivi existe, utilise les données de useDeliveryTracking
  const driverName = driver?.name || deliveryInfo.driver;
  const timeEstimate = estimatedTime || deliveryInfo.estimatedTime;
  const status = deliveryStatus || deliveryInfo.status;

  // Calcule la progression de la livraison
  const getProgressValue = () => {
    switch (status) {
      case 'pending':
        return 10;
      case 'preparing':
      case 'en préparation':
        return 30;
      case 'ready':
      case 'prepared':
        return 50;
      case 'delivering':
      case 'en livraison':
        return 75;
      case 'delivered':
      case 'livrée':
        return 100;
      default:
        return 0;
    }
  };

  // Obtenez l'état actuel pour l'affichage
  const getStepStatus = (stepStatus: string): 'completed' | 'current' | 'upcoming' => {
    const statusOrder = ['pending', 'en préparation', 'preparing', 'picked_up', 'en livraison', 'delivering', 'livrée', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Suivi de commande
          <Badge className="ml-auto" variant={status === 'livrée' || status === 'delivered' ? 'default' : 'secondary'}>
            {orderId ? `#${orderId.substring(0, 8)}` : 'Nouvelle commande'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Progress value={getProgressValue()} className="h-2" />
          
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>Commande reçue</span>
            <span>En préparation</span>
            <span>En livraison</span>
            <span>Livrée</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Informations sur la livraison */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Statut actuel</h3>
              <Badge variant={status === 'livrée' || status === 'delivered' ? 'default' : 'secondary'}>
                {status === 'pending' ? 'Commande reçue' :
                 status === 'en préparation' || status === 'preparing' ? 'En préparation' :
                 status === 'en livraison' || status === 'delivering' ? 'En livraison' :
                 status === 'livrée' || status === 'delivered' ? 'Livrée' : status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Temps estimé: {timeEstimate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Livreur: {driverName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Adresse: 123 Rue de Paris</span>
            </div>
          </div>
          
          {/* Étapes de la livraison */}
          <div className="space-y-4">
            <div className={`flex items-start gap-3 ${getStepStatus('pending') === 'completed' ? 'text-green-600' : getStepStatus('pending') === 'current' ? 'font-medium' : 'text-muted-foreground'}`}>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${getStepStatus('pending') === 'completed' ? 'bg-green-100' : 'bg-muted'}`}>
                <CheckCircle2 className={`h-4 w-4 ${getStepStatus('pending') === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-medium">Commande confirmée</p>
                <p className="text-sm text-muted-foreground">Votre commande a été reçue et est en cours de traitement</p>
              </div>
            </div>
            
            <div className={`flex items-start gap-3 ${getStepStatus('preparing') === 'completed' ? 'text-green-600' : getStepStatus('preparing') === 'current' ? 'font-medium' : 'text-muted-foreground'}`}>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${getStepStatus('preparing') === 'completed' ? 'bg-green-100' : 'bg-muted'}`}>
                <Package className={`h-4 w-4 ${getStepStatus('preparing') === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-medium">Préparation de votre commande</p>
                <p className="text-sm text-muted-foreground">Nos cuisiniers préparent vos plats avec soin</p>
              </div>
            </div>
            
            <div className={`flex items-start gap-3 ${getStepStatus('delivering') === 'completed' ? 'text-green-600' : getStepStatus('delivering') === 'current' ? 'font-medium' : 'text-muted-foreground'}`}>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${getStepStatus('delivering') === 'completed' ? 'bg-green-100' : 'bg-muted'}`}>
                <Truck className={`h-4 w-4 ${getStepStatus('delivering') === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-medium">En cours de livraison</p>
                <p className="text-sm text-muted-foreground">Votre commande est en route vers votre adresse</p>
              </div>
            </div>
            
            <div className={`flex items-start gap-3 ${getStepStatus('delivered') === 'completed' ? 'text-green-600' : getStepStatus('delivered') === 'current' ? 'font-medium' : 'text-muted-foreground'}`}>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${getStepStatus('delivered') === 'completed' ? 'bg-green-100' : 'bg-muted'}`}>
                <CheckCircle2 className={`h-4 w-4 ${getStepStatus('delivered') === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-medium">Livraison effectuée</p>
                <p className="text-sm text-muted-foreground">Bon appétit !</p>
              </div>
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 p-2 rounded text-destructive text-sm">
            {error}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Recommencer la démo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderTrackingSection;
