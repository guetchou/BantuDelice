import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Truck,
  ChefHat,
  ShoppingBag,
  User,
  Navigation
} from 'lucide-react';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  rating: number;
  vehicle: {
    type: string;
    plate: string;
  };
}

interface OrderTrackingProps {
  orderId: string;
  status: OrderStatus;
  estimatedDelivery: Date;
  driverLocation?: { lat: number; lng: number };
  driver?: Driver;
  items: OrderItem[];
  restaurantName: string;
  deliveryAddress: string;
  totalAmount: number;
  onContactDriver?: () => void;
  onContactRestaurant?: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  status,
  estimatedDelivery,
  driverLocation,
  driver,
  items,
  restaurantName,
  deliveryAddress,
  totalAmount,
  onContactDriver,
  onContactRestaurant
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculer le temps restant
  useEffect(() => {
    const remaining = estimatedDelivery.getTime() - currentTime.getTime();
    if (remaining > 0) {
      const minutes = Math.floor(remaining / 60000);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${mins}min`);
      } else {
        setTimeRemaining(`${mins}min`);
      }
    } else {
      setTimeRemaining('En retard');
    }
  }, [currentTime, estimatedDelivery]);

  // Définir les étapes du processus
  const steps = [
    { 
      key: 'pending' as OrderStatus, 
      label: 'Commande reçue', 
      icon: ShoppingBag,
      description: 'Votre commande a été reçue'
    },
    { 
      key: 'confirmed' as OrderStatus, 
      label: 'Commande confirmée', 
      icon: CheckCircle,
      description: 'Le restaurant a confirmé votre commande'
    },
    { 
      key: 'preparing' as OrderStatus, 
      label: 'En préparation', 
      icon: ChefHat,
      description: 'Vos plats sont en cours de préparation'
    },
    { 
      key: 'ready' as OrderStatus, 
      label: 'Prêt pour livraison', 
      icon: CheckCircle,
      description: 'Votre commande est prête'
    },
    { 
      key: 'out_for_delivery' as OrderStatus, 
      label: 'En route', 
      icon: Truck,
      description: 'Votre livreur est en route'
    },
    { 
      key: 'delivered' as OrderStatus, 
      label: 'Livré', 
      icon: CheckCircle,
      description: 'Votre commande a été livrée'
    }
  ];

  // Trouver l'index de l'étape actuelle
  const currentStepIndex = steps.findIndex(step => step.key === status);

  // Formater le prix en FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir le label du statut
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'out_for_delivery': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* En-tête de la commande */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Suivi de commande #{orderId}</span>
            <Badge className={getStatusColor(status)}>
              {getStatusLabel(status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{restaurantName}</h4>
              <p className="text-sm text-gray-500">{deliveryAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-600">{formatPrice(totalAmount)}</p>
              <p className="text-sm text-gray-500">
                <Clock className="inline h-4 w-4 mr-1" />
                {timeRemaining}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline des étapes */}
      <Card>
        <CardHeader>
          <CardTitle>Progression de votre commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${
                        isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <Badge variant="outline" className="text-xs">
                          En cours
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Informations du livreur */}
      {driver && status === 'out_for_delivery' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Votre livreur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img
                src={driver.photo || '/images/default-avatar.png'}
                alt={driver.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{driver.name}</h4>
                <p className="text-sm text-gray-500">
                  {driver.vehicle.type} - {driver.vehicle.plate}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${
                        i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({driver.rating})</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onContactDriver}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Appeler
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Ouvrir chat */}}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Détails de la commande */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de votre commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || '/images/placeholder-food.jpg'}
                    alt={item.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <h5 className="font-medium text-gray-900">{item.name}</h5>
                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-orange-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onContactRestaurant}
          className="flex-1"
        >
          <Phone className="h-4 w-4 mr-2" />
          Contacter le restaurant
        </Button>
        <Button
          variant="outline"
          onClick={() => {/* Ouvrir support */}}
          className="flex-1"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Support
        </Button>
      </div>
    </div>
  );
};

export default OrderTracking; 