
import { useParams } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import OrderTracking from '@/components/orders/OrderTracking';
import LiveTracking from '@/components/delivery/LiveTracking';
import { Card } from '@/components/ui/card';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrders();

  if (!orderId) {
    return <div>Commande non trouvée</div>;
  }

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Détails de la commande #{order.id.slice(0, 8)}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Status: {order.status}</p>
            <p className="text-gray-600">Total: {order.total_amount.toFixed(2)} €</p>
            <p className="text-gray-600">Adresse: {order.delivery_address}</p>
          </div>
        </Card>

        {/* Composant de suivi en temps réel */}
        <OrderTracking orderId={orderId} />
      </div>

      {/* Carte de suivi de livraison */}
      <LiveTracking orderId={orderId} />
    </div>
  );
}
