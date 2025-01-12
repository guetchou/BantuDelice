import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const OrderHistory = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement de l'historique...</div>;
  }

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {orders?.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">
                  Commande #{order.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.created_at), "PPP 'à' HH:mm", { locale: fr })}
                </p>
              </div>
              <Badge variant={
                order.status === 'completed' ? 'default' :
                order.status === 'pending' ? 'secondary' :
                order.status === 'processing' ? 'secondary' : 'destructive'
              }>
                {order.status === 'completed' ? 'Terminée' :
                 order.status === 'pending' ? 'En attente' :
                 order.status === 'processing' ? 'En préparation' : 'Annulée'}
              </Badge>
            </div>
            <div className="space-y-2">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.item_name}</span>
                  <span>{(item.price / 100).toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                {(order.total_amount / 100).toLocaleString()} FCFA
              </span>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default OrderHistory;