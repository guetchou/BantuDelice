
import { useEffect } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

const Orders = () => {
  usePageTitle({ title: "Mes commandes" });
  const { activeOrders, pastOrders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-indigo-500';
      case 'prepared':
        return 'bg-purple-500';
      case 'delivering':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>

      {activeOrders.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Commandes actives</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">Commande #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {formatStatus(order.status)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Montant:</span>{' '}
                    {(order.total_amount / 100).toFixed(2)}€
                  </p>
                  {order.estimated_preparation_time && (
                    <p className="text-sm">
                      <span className="font-medium">Temps estimé:</span>{' '}
                      {order.estimated_preparation_time} min
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Livraison:</span>{' '}
                    {order.delivery_address}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Historique des commandes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">Commande #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {formatStatus(order.status)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Montant:</span>{' '}
                    {(order.total_amount / 100).toFixed(2)}€
                  </p>
                  {order.loyalty_points_earned && (
                    <p className="text-sm text-green-600">
                      +{order.loyalty_points_earned} points gagnés
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeOrders.length === 0 && pastOrders.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <p>Vous n'avez pas encore de commandes</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
