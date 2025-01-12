import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardBarChart } from "@/components/DashboardBarChart";
import { DashboardChart } from "@/components/DashboardChart";
import { DashboardCard } from "@/components/DashboardCard";
import { 
  Users, ShoppingBag, CreditCard, TrendingUp,
  ChefHat, Clock, Star, Calendar
} from "lucide-react";

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0,0,0,0)).toISOString();
      const endOfDay = new Date(today.setHours(23,59,59,999)).toISOString();

      const [orders, users, revenue] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay),
        supabase
          .from('profiles')
          .select('count', { count: 'exact' }),
        supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay)
      ]);

      if (orders.error || users.error || revenue.error) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const totalRevenue = revenue.data.reduce((acc, order) => acc + order.total_amount, 0);

      return {
        ordersToday: orders.data.length,
        totalUsers: users.count || 0,
        revenueToday: totalRevenue,
        averageOrderValue: orders.data.length ? totalRevenue / orders.data.length : 0
      };
    },
    refetchInterval: 300000 // Rafraîchir toutes les 5 minutes
  });

  if (isLoading) {
    return <div>Chargement du tableau de bord...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Commandes aujourd'hui"
          value={stats?.ordersToday.toString() || "0"}
          description="Total des commandes du jour"
          icon={ShoppingBag}
        />
        <DashboardCard
          title="Chiffre d'affaires"
          value={`${(stats?.revenueToday / 100).toLocaleString()} FCFA`}
          description="Revenus du jour"
          icon={CreditCard}
        />
        <DashboardCard
          title="Utilisateurs"
          value={stats?.totalUsers.toString() || "0"}
          description="Nombre total d'utilisateurs"
          icon={Users}
        />
        <DashboardCard
          title="Panier moyen"
          value={`${(stats?.averageOrderValue / 100).toLocaleString()} FCFA`}
          description="Valeur moyenne des commandes"
          icon={TrendingUp}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ventes hebdomadaires</h3>
                <DashboardBarChart />
              </div>
            </Card>
            <Card className="col-span-3">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Répartition des commandes</h3>
                <DashboardChart />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;