
import React from 'react';
import { Bell, Check, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '@/types/order';

interface OrderNotificationProps {
  order: Order;
  onClose: () => void;
}

const OrderNotification = ({ order, onClose }: OrderNotificationProps) => {
  const getStatusIcon = () => {
    switch (order.status) {
      case 'accepted':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'preparing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-orange-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (order.status) {
      case 'accepted':
        return 'Votre commande a été acceptée !';
      case 'preparing':
        return 'Votre commande est en préparation';
      case 'prepared':
        return 'Votre commande est prête !';
      case 'delivering':
        return 'Votre commande est en cours de livraison';
      case 'delivered':
        return 'Votre commande a été livrée';
      case 'cancelled':
        return 'Votre commande a été annulée';
      default:
        return 'Mise à jour de votre commande';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 w-96 bg-white rounded-lg shadow-lg p-4 z-50"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="font-medium">{getStatusMessage()}</p>
              <p className="text-sm text-gray-500">
                Commande #{order.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {order.estimated_preparation_time && (
          <div className="mt-3 text-sm text-gray-600">
            Temps de préparation estimé: {order.estimated_preparation_time} min
          </div>
        )}

        {order.loyalty_points_earned && (
          <div className="mt-2 text-sm text-green-600">
            +{order.loyalty_points_earned} points de fidélité gagnés !
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderNotification;
