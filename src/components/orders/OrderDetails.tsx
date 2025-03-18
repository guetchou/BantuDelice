
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/order';
import { Loader2 } from 'lucide-react';
import OrderProgress from './OrderProgress';

interface OrderDetailsProps {
  orderId?: string;
}

const OrderDetails = ({ orderId: propOrderId }: OrderDetailsProps) => {
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const orderId = propOrderId || paramOrderId;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('ID de commande manquant');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (fetchError) throw fetchError;
        
        if (data) {
          setOrder(data as unknown as Order);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de la commande:', err);
        setError('Impossible de charger les détails de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card className="p-6">
        <p className="text-center text-red-500">{error || 'Commande non trouvée'}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Détails de la commande #{order.id.slice(-6)}</h2>
      
      <div className="mb-6">
        <OrderProgress status={order.status} orderId={order.id} />
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Informations générales</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-600">Date de commande</p>
            <p>{new Date(order.created_at).toLocaleString('fr-FR')}</p>
            
            <p className="text-gray-600">Statut</p>
            <p>{order.status}</p>
            
            <p className="text-gray-600">Montant total</p>
            <p>{(order.total_amount / 100).toFixed(2)}€</p>
            
            <p className="text-gray-600">Adresse de livraison</p>
            <p>{order.delivery_address || 'Non spécifiée'}</p>
          </div>
        </div>
        
        {order.special_instructions && (
          <div>
            <h3 className="font-medium mb-2">Instructions spéciales</h3>
            <p className="text-sm bg-gray-50 p-3 rounded">{order.special_instructions}</p>
          </div>
        )}
        
        <div>
          <h3 className="font-medium mb-2">Éléments de la commande</h3>
          <p className="text-sm text-gray-500">Les détails des articles commandés ne sont pas disponibles.</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Paiement</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-600">Méthode de paiement</p>
            <p>{order.payment_method || 'Non spécifiée'}</p>
            
            <p className="text-gray-600">Statut du paiement</p>
            <p>{order.payment_status}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="sm">
          Contacter le support
        </Button>
      </div>
    </Card>
  );
};

export default OrderDetails;
