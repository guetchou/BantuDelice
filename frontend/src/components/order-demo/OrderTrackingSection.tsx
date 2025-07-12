
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DeliveryDriver, DeliveryLocation, DeliveryStatus } from "@/types/delivery";
import { Phone, RefreshCw } from "lucide-react";

interface OrderTrackingProps {
  refreshTracking: () => void;
  contactDriver: () => void;
  orderId: string;
  driver: DeliveryDriver;
  status: DeliveryStatus;
  estimatedDeliveryTime: string;
  route: DeliveryLocation[];
  currentLocation: DeliveryLocation;
  loading: boolean;
  error: string;
  // Ajout des propriétés manquantes
  deliveryStatus?: string;
  estimatedTime?: string;
}

const OrderTrackingSection: React.FC<OrderTrackingProps> = ({
  refreshTracking,
  contactDriver,
  driver,
  status,
  estimatedDeliveryTime,
  loading,
  error,
  // Utilisation des propriétés ou valeurs par défaut
  deliveryStatus = "en_cours",
  estimatedTime = "30-45 min"
}) => {
  const { toast } = useToast();

  const handleContactDriver = () => {
    contactDriver();
    toast({
      title: "Contacter le livreur",
      description: `Vous allez être mis en relation avec ${driver.name}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Suivi de livraison</span>
          <Button variant="ghost" size="sm" onClick={refreshTracking} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-destructive text-sm">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <p className="font-medium">{status || deliveryStatus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Arrivée estimée</p>
                <p className="font-medium">{estimatedDeliveryTime || estimatedTime}</p>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {driver?.name?.charAt(0) || "D"}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{driver?.name || "Livreur"}</p>
                  <p className="text-sm text-muted-foreground">{driver?.vehicle_type || "Véhicule standard"}</p>
                </div>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="ml-auto" 
                  onClick={handleContactDriver}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="h-40 border rounded-md bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Carte de suivi</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTrackingSection;
