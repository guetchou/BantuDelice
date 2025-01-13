import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Store,
  ShoppingBag,
  Star,
  Clock,
  ChefHat,
  TrendingUp
} from "lucide-react";

interface RestaurantStats {
  totalOrders: number;
  averageRating: number;
  pendingOrders: number;
  preparingOrders: number;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurantStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        // Get restaurant ID
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!restaurant) {
          toast.error("Restaurant non trouvé");
          return;
        }

        // Get orders stats
        const { data: orders } = await supabase
          .from("orders")
          .select("status, rating")
          .eq("restaurant_id", restaurant.id);

        if (!orders) return;

        const stats = {
          totalOrders: orders.length,
          averageRating: orders.reduce((acc, order) => acc + (order.rating || 0), 0) / orders.length || 0,
          pendingOrders: orders.filter(o => o.status === "pending").length,
          preparingOrders: orders.filter(o => o.status === "preparing").length,
        };

        setStats(stats);
      } catch (error) {
        console.error("Error loading restaurant stats:", error);
        toast.error("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord restaurant</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Commandes totales</h2>
              <p className="text-2xl font-bold">{stats?.totalOrders}</p>
            </div>
          </div>
        </Card>

        {/* Average Rating */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Star className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Note moyenne</h2>
              <p className="text-2xl font-bold">{stats?.averageRating.toFixed(1)}/5</p>
            </div>
          </div>
        </Card>

        {/* Pending Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Commandes en attente</h2>
              <p className="text-2xl font-bold">{stats?.pendingOrders}</p>
            </div>
          </div>
        </Card>

        {/* Preparing Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ChefHat className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">En préparation</h2>
              <p className="text-2xl font-bold">{stats?.preparingOrders}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Button
          variant="outline"
          className="h-auto py-6"
          onClick={() => navigate("/restaurant/orders")}
        >
          <ShoppingBag className="w-6 h-6 mr-2" />
          Gérer les commandes
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6"
          onClick={() => navigate("/restaurant/menu")}
        >
          <Store className="w-6 h-6 mr-2" />
          Gérer le menu
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6"
          onClick={() => navigate("/restaurant/analytics")}
        >
          <TrendingUp className="w-6 h-6 mr-2" />
          Statistiques
        </Button>
      </div>
    </div>
  );
};

export default RestaurantDashboard;