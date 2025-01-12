import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Timer, ChefHat } from "lucide-react";
import Navbar from "@/components/Navbar";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface OrderItem {
  item_name: string;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  created_at: string;
  user_id: string;
  order_items: OrderItem[];
}

const KitchenDashboard = () => {
  const { toast } = useToast();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["kitchen-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          created_at,
          user_id,
          order_items (
            item_name,
            quantity
          )
        `)
        .in("status", ["pending", "preparing"])
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Order[];
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload: RealtimePostgresChangesPayload<Order>) => {
          console.log("Order change received:", payload);
          if (payload.new && 'id' in payload.new) {
            setActiveOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (orders) {
      setActiveOrders(orders);
    }
  }, [orders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Commande ${orderId} marquée comme ${newStatus}`,
      });

      const orderToUpdate = activeOrders.find((o) => o.id === orderId);
      if (orderToUpdate) {
        await supabase.from("notifications").insert({
          user_id: orderToUpdate.user_id,
          type: "order_status",
          message: `Votre commande est maintenant ${newStatus}`,
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 p-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Interface Cuisine</h1>
          <ChefHat className="w-8 h-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((order) => (
            <Card key={order.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  Commande #{order.id.slice(0, 8)}
                </CardTitle>
                <Badge
                  variant={order.status === "preparing" ? "default" : "secondary"}
                >
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    <span>
                      {new Date(order.created_at).toLocaleTimeString("fr-FR")}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {order.order_items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.item_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-4">
                    {order.status === "pending" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                        className="w-full"
                      >
                        Commencer la préparation
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "completed")}
                        className="w-full"
                      >
                        Terminer
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;