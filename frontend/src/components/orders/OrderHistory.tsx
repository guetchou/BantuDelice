
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ShoppingBag } from "lucide-react";

const OrderHistory = () => {
  const navigate = useNavigate();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), restaurants(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Terminée</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'processing':
        return <Badge variant="secondary">En préparation</Badge>;
      case 'delivering':
        return <Badge variant="secondary" className="animate-pulse">En livraison</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="border-green-500 text-green-600">Livrée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-6">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium">Aucune commande</h3>
        <p className="text-sm text-gray-500 mb-4">Vous n'avez pas encore effectué de commande</p>
        <Button onClick={() => navigate('/restaurants')}>Commander maintenant</Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] w-full rounded-md p-1">
      <div className="space-y-4 pr-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Commande #{order.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.created_at), "PPP 'à' HH:mm", { locale: fr })}
                </p>
                {order.restaurants?.name && (
                  <p className="text-sm font-medium mt-1">{order.restaurants.name}</p>
                )}
              </div>
              {getStatusBadge(order.status)}
            </div>
            <div className="space-y-2">
              {order.order_items?.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.item_name}</span>
                  <span>{parseInt(item.price).toLocaleString()} FCFA</span>
                </div>
              ))}
              {order.order_items && order.order_items.length > 3 && (
                <p className="text-sm text-muted-foreground italic">
                  + {order.order_items.length - 3} autres articles
                </p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                {order.total_amount.toLocaleString()} FCFA
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                Détails
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default OrderHistory;
