
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { OrderStatus } from '@/types/order';
import { CheckCircle, Clock, CookingPot, Package, Truck, XCircle } from 'lucide-react';

interface OrderProgressProps {
  status: OrderStatus | string;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ status }) => {
  const getProgressValue = (): number => {
    switch (status) {
      case 'pending':
        return 0;
      case 'accepted':
        return 20;
      case 'preparing':
        return 40;
      case 'prepared':
        return 60;
      case 'delivering':
        return 80;
      case 'delivered':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case 'preparing':
        return <CookingPot className="h-6 w-6 text-orange-500" />;
      case 'prepared':
        return <Package className="h-6 w-6 text-green-500" />;
      case 'delivering':
        return <Truck className="h-6 w-6 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'pending':
        return 'Commande en attente de confirmation';
      case 'accepted':
        return 'Commande acceptée par le restaurant';
      case 'preparing':
        return 'Préparation en cours';
      case 'prepared':
        return 'Commande prête pour la livraison';
      case 'delivering':
        return 'En cours de livraison';
      case 'delivered':
        return 'Commande livrée';
      case 'cancelled':
        return 'Commande annulée';
      default:
        return 'Statut inconnu';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Statut de la commande</h3>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className="ml-2 text-sm font-medium">{getStatusText()}</span>
        </div>
      </div>
      <Progress value={getProgressValue()} className="h-2" />
      <div className="grid grid-cols-5 text-xs text-center">
        <div className={`${status === 'accepted' || getProgressValue() >= 20 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Acceptée
        </div>
        <div className={`${status === 'preparing' || getProgressValue() >= 40 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Préparation
        </div>
        <div className={`${status === 'prepared' || getProgressValue() >= 60 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Prête
        </div>
        <div className={`${status === 'delivering' || getProgressValue() >= 80 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          En livraison
        </div>
        <div className={`${status === 'delivered' || getProgressValue() >= 100 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          Livrée
        </div>
      </div>
    </div>
  );
};

export default OrderProgress;
