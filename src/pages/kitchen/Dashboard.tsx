import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import DashboardCard from "@/components/DashboardCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, ChefHat, Check } from "lucide-react";

interface Order {
  id: string;
  status: string;
  created_at: string;
  restaurant_id: string;
  total_amount: number;
  delivery_address: string;
  user_id: string;
  accepted_at?: string;
  prepared_at?: string;
}

const KitchenDashboard = () => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch initial orders
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["pending", "accepted", "preparing"])
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les commandes",
          variant: "destructive",
        });
        return;
      }

      setActiveOrders(data as Order[]);
    };

    fetchOrders();

    // Subscribe to real-time updates
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
          const newOrder = payload.new;
          if (newOrder && typeof newOrder === 'object' && 'id' in newOrder) {
            setActiveOrders((prev) =>
              prev.map((order) =>
                order.id === newOrder.id ? { ...order, ...newOrder } : order
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ 
        status: newStatus,
        ...(newStatus === 'accepted' ? { accepted_at: new Date().toISOString() } : {}),
        ...(newStatus === 'prepared' ? { prepared_at: new Date().toISOString() } : {})
      })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commande",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "La commande a été mise à jour",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord - Cuisine</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Commandes en attente"
          value={activeOrders.filter((o) => o.status === "pending").length.toString()}
          icon={<Clock className="w-6 h-6" />}
        />
        <DashboardCard
          title="Commandes en préparation"
          value={activeOrders.filter((o) => o.status === "preparing").length.toString()}
          icon={<ChefHat className="w-6 h-6" />}
        />
        <DashboardCard
          title="Commandes prêtes"
          value={activeOrders.filter((o) => o.status === "prepared").length.toString()}
          icon={<Check className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Commande #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <Badge
                variant={
                  order.status === "pending"
                    ? "default"
                    : order.status === "accepted"
                    ? "secondary"
                    : "outline"
                }
              >
                {order.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <p>
                <span className="font-medium">Montant:</span>{" "}
                {(order.total_amount / 100).toFixed(2)}€
              </p>
              <p>
                <span className="font-medium">Adresse:</span>{" "}
                {order.delivery_address}
              </p>
            </div>

            <div className="flex gap-2">
              {order.status === "pending" && (
                <Button
                  className="flex-1"
                  onClick={() => updateOrderStatus(order.id, "accepted")}
                >
                  Accepter
                </Button>
              )}
              {order.status === "accepted" && (
                <Button
                  className="flex-1"
                  onClick={() => updateOrderStatus(order.id, "preparing")}
                >
                  Commencer la préparation
                </Button>
              )}
              {order.status === "preparing" && (
                <Button
                  className="flex-1"
                  onClick={() => updateOrderStatus(order.id, "prepared")}
                >
                  Marquer comme prêt
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenDashboard;