
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle, ArrowRight, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show a toast when the page loads
    toast({
      title: "Commande confirmée",
      description: "Votre commande a été traitée avec succès.",
    });
  }, [toast]);

  // Mock order details
  const orderDetails = {
    id: id || 'order-12345',
    restaurantName: 'Burger Deluxe',
    deliveryAddress: '123 Rue de Paris, 75001 Paris',
    estimatedDeliveryTime: '30-45 minutes',
  };

  const handleTrackOrder = () => {
    navigate(`/order-tracking/${orderDetails.id}`);
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Commande confirmée !</h1>
        <p className="text-muted-foreground">
          Votre commande #{id?.substring(0, 6)} a été reçue et est en cours de préparation.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Détails de la commande</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTrackOrder}
              className="flex items-center gap-1"
            >
              Suivre <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Adresse de livraison</p>
              <p className="text-muted-foreground text-sm">{orderDetails.deliveryAddress}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Temps de livraison estimé</p>
              <p className="text-muted-foreground text-sm">{orderDetails.estimatedDeliveryTime}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2 pt-0">
          <Button 
            className="w-full" 
            onClick={handleTrackOrder}
          >
            Suivre la commande
          </Button>
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleViewOrders}
            >
              Mes commandes
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleReturnHome}
            >
              Accueil
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Besoin d'aide ? <a href="#" className="underline underline-offset-4">Contactez-nous</a>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
