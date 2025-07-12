
import { AlertCircle, CheckCircle, Clock, Coffee } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OrderStatus } from '@/types/order';

interface OrderStatusAlertProps {
  status: OrderStatus;
  isRestaurantOpen?: boolean;
}

const OrderStatusAlert = ({ status, isRestaurantOpen = true }: OrderStatusAlertProps) => {
  if (status === 'delivered') {
    return (
      <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Commande livrée</AlertTitle>
        <AlertDescription>
          Votre commande a été livrée avec succès. Nous vous remercions pour votre confiance !
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'cancelled') {
    return (
      <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Commande annulée</AlertTitle>
        <AlertDescription>
          Cette commande a été annulée.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'preparing') {
    return (
      <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
        <Coffee className="h-4 w-4" />
        <AlertTitle>Préparation en cours</AlertTitle>
        <AlertDescription>
          Votre commande est en cours de préparation par le restaurant.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'pending') {
    return (
      <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
        <Clock className="h-4 w-4" />
        <AlertTitle>En attente de confirmation</AlertTitle>
        <AlertDescription>
          {isRestaurantOpen 
            ? 'Le restaurant va bientôt confirmer votre commande.'
            : 'Le restaurant est actuellement fermé. Votre commande sera traitée à l\'ouverture.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'delivering') {
    return (
      <Alert className="mb-4 bg-purple-50 text-purple-800 border-purple-200">
        <Clock className="h-4 w-4" />
        <AlertTitle>En cours de livraison</AlertTitle>
        <AlertDescription>
          Votre commande est en route vers l'adresse de livraison indiquée.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default OrderStatusAlert;
