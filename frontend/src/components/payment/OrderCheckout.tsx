
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentForm } from './PaymentForm';
import { useLoyalty } from '@/hooks/useLoyalty';
import { orderService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface OrderCheckoutProps {
  orderId: string;
  amount: number;
  restaurantId: string;
}

export const OrderCheckout: React.FC<OrderCheckoutProps> = ({
  orderId,
  amount,
  restaurantId
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { addPoints } = useLoyalty();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePaymentComplete = async () => {
    try {
      setIsProcessing(true);
      
      // Mettre à jour le statut de la commande
      const updateResponse = await orderService.update(orderId, {
        status: 'paid',
        payment_status: 'completed',
        updated_at: new Date().toISOString()
      });
      
      if (updateResponse.error) {
        throw updateResponse.error;
      }
      
      // Ajouter des points de fidélité (1 point par 100 de montant)
      const pointsToAdd = Math.floor(amount / 100);
      if (pointsToAdd > 0) {
        await addPoints(pointsToAdd, `Commande #${orderId.substring(0, 8)}`);
      }
      
      // Notification et redirection
      toast({
        title: "Paiement réussi",
        description: "Votre commande a été confirmée et est en cours de traitement.",
      });
      
      // Rediriger vers la page de confirmation
      navigate(`/order-confirmation/${orderId}`);
      
    } catch (error) {
      console.error('Erreur lors de la finalisation de la commande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la finalisation de votre commande.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Finaliser votre commande</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentForm
          amount={amount}
          orderId={orderId}
          onPaymentComplete={handlePaymentComplete}
          description="Paiement de commande"
        />
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>
          Vous recevrez des points de fidélité pour cette commande.
        </p>
      </CardFooter>
    </Card>
  );
};
