import { useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Package, Calendar, Info } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import OrderProgress from '@/components/orders/OrderProgress';

const Orders = () => {
  usePageTitle({ title: "Mes commandes" });
  const { activeOrders, pastOrders, isLoading, refetchOrders } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    refetchOrders();
  }, [refetchOrders]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-indigo-100 text-indigo-800';
      case 'prepared':
        return 'bg-purple-100 text-purple-800';
      case 'delivering':
        return 'bg-orange-100 text-orange-800 animate-pulse';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'En attente',
      accepted: 'Acceptée',
      preparing: 'En préparation',
      prepared: 'Prête',
      delivering: 'En livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM à HH:mm", { locale: fr });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>

      {activeOrders.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Commandes actives
          </h2>
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="p-4 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Commande #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {formatStatus(order.status)}
                  </Badge>
                </div>

                <div className="mt-4">
                  <OrderProgress 
                    status={order.status} 
                    orderId={order.id} 
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">
                      <span className="font-medium">Montant:</span>{' '}
                      {(order.total_amount / 100).toFixed(2)}FCFA 
                    </p>
                    {order.estimated_preparation_time && (
                      <p className="text-sm">
                        <span className="font-medium">Temps estimé:</span>{' '}
                        {order.estimated_preparation_time} min
                      </p>
                    )}
                  </div>
                  
                  <p className="text-sm">
                    <span className="font-medium">Livraison:</span>{' '}
                    {order.delivery_address || 'Adresse non disponible'}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    {expandedOrder === order.id ? 'Masquer les détails' : 'Voir les détails'}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="ml-2"
                    asChild
                  >
                    <Link to={`/order-tracking/${order.id}`}>
                      Suivre
                    </Link>
                  </Button>
                </div>

                {expandedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium mb-2">Détails de la commande</h4>
                    <p className="text-sm text-gray-500">
                      Informations détaillées sur la commande non disponibles.
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Historique des commandes
          </h2>
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Commande #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <Badge variant={order.status === 'delivered' ? 'outline' : 'destructive'}>
                    {formatStatus(order.status)}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">
                      <span className="font-medium">Montant:</span>{' '}
                      {(order.total_amount / 100).toFixed(2)}FCFA 
                    </p>
                    
                    {order.delivered_at && (
                      <p className="text-sm">
                        <span className="font-medium">Livrée le:</span>{' '}
                        {formatDate(order.delivered_at)}
                      </p>
                    )}
                  </div>
                  
                  {order.loyalty_points_earned && (
                    <p className="text-sm text-green-600">
                      +{order.loyalty_points_earned} points gagnés
                    </p>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    {expandedOrder === order.id ? 'Masquer les détails' : 'Voir les détails'}
                  </Button>
                </div>

                {expandedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium mb-2">Détails de la commande</h4>
                    <p className="text-sm text-gray-500">
                      Informations détaillées sur la commande non disponibles.
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeOrders.length === 0 && pastOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Info className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
          <Button asChild>
            <Link to="/restaurants">
              Explorer les restaurants
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders;
