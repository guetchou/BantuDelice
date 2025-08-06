import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartBar, TrendingUp, DollarSign, Clock } from "lucide-react";
// Navbar removed - now handled by MainLayout
// import { useSidebar } from "@/contexts/SidebarContext";
import DashboardChart from "@/components/DashboardChart";
import DashboardBarChart from "@/components/DashboardBarChart";

const AnalyticsDashboard = () => {
  // const { isCollapsed } = useSidebar();
  const isCollapsed = false;
  const [timeRange, setTimeRange] = useState("7d");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: async () => {
      const range = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 365;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte(
          "created_at",
          new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) throw error;

      const totalOrders = data.length;
      const totalRevenue = data.reduce((sum, order) => sum + order.total_amount, 0);
      const avgPreparationTime = data.reduce(
        (sum, order) =>
          sum +
          (order.prepared_at
            ? new Date(order.prepared_at).getTime() -
              new Date(order.created_at).getTime()
            : 0),
        0
      ) / totalOrders;

      return {
        totalOrders,
        totalRevenue,
        avgPreparationTime: Math.round(avgPreparationTime / (1000 * 60)), // Convert to minutes
        ordersByStatus: {
          pending: data.filter((o) => o.status === "pending").length,
          preparing: data.filter((o) => o.status === "preparing").length,
          completed: data.filter((o) => o.status === "completed").length,
        },
      };
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Navbar removed - now handled by MainLayout */}
      <div className="flex-1 p-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Rapports Analytiques</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="365d">Année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Commandes Totales
              </CardTitle>
              <ChartBar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Chiffre d'Affaires
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalRevenue.toLocaleString()} XAF
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Temps Moyen de Préparation
              </CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.avgPreparationTime} min
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Taux de Complétion
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.ordersByStatus.completed
                  ? Math.round(
                      (stats.ordersByStatus.completed / stats.totalOrders) * 100
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Évolution des Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardChart />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Répartition par Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardBarChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
