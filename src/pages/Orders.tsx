import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  created_at: string;
  status: string;
  service_name: string;
  total_amount: number;
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          status,
          service_provider:service_providers(name),
          total_amount
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Order interface
      const transformedOrders = (data || []).map(order => ({
        id: order.id,
        created_at: order.created_at,
        status: order.status,
        service_name: order.service_provider?.name || 'Unknown Service',
        total_amount: order.total_amount
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes Réservations</h1>
      
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            Aucune réservation trouvée
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {order.service_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Badge
                  variant={order.status === 'completed' ? 'default' : 
                          order.status === 'pending' ? 'secondary' : 
                          'destructive'}
                >
                  {order.status === 'completed' ? 'Terminé' :
                   order.status === 'pending' ? 'En attente' : 
                   'Annulé'}
                </Badge>
              </div>
              <div className="mt-4 text-right">
                <p className="font-medium">
                  {order.total_amount.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;