import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { Loader2, AlertTriangle } from "lucide-react";

interface AdminProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Admin = ({ isCollapsed, setIsCollapsed }: AdminProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (!roles || roles.role !== "admin") {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration nécessaires.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdminRole();
  }, [navigate, toast]);

  // Fetch orders statistics
  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ["orderStats"],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("status, rating, restaurant_rating")
        .order("created_at", { ascending: false });

      if (!orders) return null;

      const stats = {
        total: orders.length,
        completed: orders.filter(o => o.status === "completed").length,
        pending: orders.filter(o => o.status === "pending").length,
        avgRating: orders.reduce((acc, curr) => acc + (curr.rating || 0), 0) / orders.filter(o => o.rating).length || 0,
        avgRestaurantRating: orders.reduce((acc, curr) => acc + (curr.restaurant_rating || 0), 0) / orders.filter(o => o.restaurant_rating).length || 0,
      };

      return stats;
    },
    enabled: isAdmin,
  });

  // Fetch recent orders
  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            item_name,
            quantity,
            price
          ),
          delivery_tracking (
            status,
            latitude,
            longitude
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      return orders;
    },
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex-1 p-8 pt-6">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Commandes Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : orderStats?.total}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Commandes en Attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : orderStats?.pending}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Note Moyenne Livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `${orderStats?.avgRating.toFixed(1)}/5`
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Note Moyenne Restaurant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `${orderStats?.avgRestaurantRating.toFixed(1)}/5`
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Commandes Récentes</CardTitle>
            <CardDescription>
              Les 10 dernières commandes enregistrées dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Livraison</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.total_amount}€</TableCell>
                      <TableCell>
                        {order.order_items?.map((item, index) => (
                          <div key={index}>
                            {item.quantity}x {item.item_name}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {order.rating ? (
                          <div>
                            Livraison: {order.rating}/5
                            {order.restaurant_rating && (
                              <div>Restaurant: {order.restaurant_rating}/5</div>
                            )}
                          </div>
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.delivery_tracking?.[0]?.status === "delivered"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {order.delivery_tracking?.[0]?.status || "en attente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;