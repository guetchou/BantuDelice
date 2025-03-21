
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Package, Truck } from 'lucide-react';
import { Steps, Step } from "@/components/ui/steps";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DeliveryInfo {
  driver: string;
  estimatedTime: string;
  status: string;
}

interface OrderTrackingSectionProps {
  orderId: string | null;
  currentStep: number;
  deliveryInfo: DeliveryInfo;
  onReset: () => void;
}

const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({ 
  orderId, 
  currentStep, 
  deliveryInfo, 
  onReset 
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Suivi de commande #{orderId}</h2>
      
      <Steps activeStep={currentStep} className="mb-6">
        <Step icon={Check}>Commande confirmée</Step>
        <Step icon={Package}>Préparation</Step>
        <Step icon={Truck}>En livraison</Step>
        <Step icon={Check}>Livrée</Step>
      </Steps>
      
      {currentStep > 1 && (
        <div className="mt-4 p-4 border rounded-lg">
          <div className="flex items-center gap-4 mb-2">
            <Avatar>
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Livreur: {deliveryInfo.driver}</h3>
              <p className="text-sm">Estimation: {deliveryInfo.estimatedTime}</p>
            </div>
          </div>
          <p className="text-sm">Statut: <span className="font-semibold">{deliveryInfo.status}</span></p>
        </div>
      )}
      
      {currentStep === 4 && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Votre commande a été livrée avec succès!
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={onReset} 
        className="mt-6 w-full"
        variant="outline"
      >
        Recommencer la démo
      </Button>
    </Card>
  );
};

export default OrderTrackingSection;
