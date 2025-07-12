
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  
  // Share order details
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Commande #${orderId?.substring(0, 8)}`,
        text: `J'ai passé une commande chez EazyCongo! Numéro de commande: ${orderId}`,
        url: window.location.href
      })
      .catch(error => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: 'Lien copié',
            description: 'Le lien de suivi a été copié dans votre presse-papier',
          });
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux commandes
        </Link>
      </div>
      
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Commande confirmée !</CardTitle>
          <CardDescription>
            Votre commande #{orderId?.substring(0, 8)} a été reçue et est en cours de traitement
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Détails de la commande</h3>
            <p className="text-sm text-muted-foreground">
              Vous recevrez un e-mail de confirmation avec les détails de votre commande.
            </p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Suivi de commande</h3>
            <p className="text-sm text-muted-foreground">
              Vous pouvez suivre l'état de votre commande en temps réel.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 sm:flex-row">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleShare}
          >
            Partager la commande
          </Button>
          <Button 
            className="w-full" 
            asChild
          >
            <Link to={`/order/${orderId}/tracking`}>
              Suivre ma commande
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
